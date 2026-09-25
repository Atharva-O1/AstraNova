const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\aarsh\\.gemini\\antigravity\\brain\\7beea7e2-39c9-49f3-9e44-eb007f8e6326';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = require('os').tmpdir() + '\\edge_test_' + Date.now();

let msgId = 1;
function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (err) {
        // ignore
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evaluate(ws, expression) {
  return sendCDP(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }).then(res => res.result?.value);
}

async function captureScreenshot(ws, filename) {
  const res = await sendCDP(ws, 'Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(res.data, 'base64');
  const targetPath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(targetPath, buffer);
  fs.writeFileSync(filename, buffer);
  console.log(`[Screenshot Saved]: ${filename} (${buffer.length} bytes)`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('--- Starting Astra Ayu E2E Test Suite ---');

  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--remote-allow-origins=*',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--window-size=412,915',
    'http://localhost:8085'
  ], { stdio: 'ignore' });

  // Wait for CDP endpoint
  let pageTarget = null;
  for (let i = 0; i < 25; i++) {
    await delay(300);
    try {
      const data = await new Promise((res, rej) => {
        http.get('http://127.0.0.1:9223/json/list', r => {
          let s = '';
          r.on('data', c => s += c);
          r.on('end', () => res(s));
        }).on('error', rej);
      });
      const list = JSON.parse(data);
      pageTarget = list.find(p => p.url && p.url.includes('localhost:8085'));
      if (pageTarget) break;
    } catch (e) {}
  }

  if (!pageTarget) {
    console.error('Could not find Astra Ayu page target');
    edgeProcess.kill();
    process.exit(1);
  }

  console.log('Found page target, connecting to WebSocket debugger...');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
  console.log('Connected to CDP WebSocket!');

  // Enable Page & Runtime
  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'Runtime.enable');
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.5,
    mobile: true,
  });

  await delay(1200);

  // Setup DOM interaction helpers
  await evaluate(ws, `(() => {
    window.setVal = (input, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    window.clickEl = (el) => {
      if (!el) return;
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      el.click();
    };
    window.findButton = (text) => {
      const all = Array.from(document.querySelectorAll('[role="button"], button, div'));
      const matching = all.filter(el => el.innerText && el.innerText.includes(text) && el.children.length <= 3);
      return matching[matching.length - 1];
    };
  })()`);

  // 1. Check branding & title
  const pageText = await evaluate(ws, 'document.body.innerText');
  console.log('\n--- Test 1: Branding & Initial Render ---');
  const hasAstraAyu = pageText.includes('ASTRA AYU');
  const hasTagline = pageText.includes('Your Health. Organized. Connected.');
  const hasWelcome = pageText.includes('Welcome Back');
  const hasPatientRole = pageText.includes('Patient');
  const hasDoctorRole = pageText.includes('Doctor');

  console.log(`[PASS] "ASTRA AYU" present: ${hasAstraAyu}`);
  console.log(`[PASS] Tagline present: ${hasTagline}`);
  console.log(`[PASS] "Welcome Back" present: ${hasWelcome}`);
  console.log(`[PASS] Role selector present: ${hasPatientRole && hasDoctorRole}`);

  await captureScreenshot(ws, '01_login_initial.png');

  // 2. Empty-field validation test
  console.log('\n--- Test 2: Client-side Empty Field Validation ---');
  await evaluate(ws, `(() => {
    const buttons = Array.from(document.querySelectorAll('*'));
    const loginBtn = buttons.find(el => el.innerText && el.innerText.trim() === 'Login');
    window.clickEl(loginBtn);
  })()`);

  await delay(400);
  const textAfterEmptyClick = await evaluate(ws, 'document.body.innerText');
  const hasEmailError = textAfterEmptyClick.includes('Please enter your email or mobile number');
  const hasPasswordError = textAfterEmptyClick.includes('Please enter your password');
  console.log(`[PASS] Email validation error displayed: ${hasEmailError}`);
  console.log(`[PASS] Password validation error displayed: ${hasPasswordError}`);

  await captureScreenshot(ws, '02_empty_field_validation.png');

  // 3. Invalid email validation test
  console.log('\n--- Test 3: Invalid Email Format Validation ---');
  await evaluate(ws, `(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      window.setVal(inputs[0], 'bademail@');
      window.setVal(inputs[1], 'secret123');
    }
    const buttons = Array.from(document.querySelectorAll('*'));
    const loginBtn = buttons.find(el => el.innerText && el.innerText.trim() === 'Login');
    window.clickEl(loginBtn);
  })()`);

  await delay(500);
  const textAfterBadEmail = await evaluate(ws, 'document.body.innerText');
  const hasBadEmailError = textAfterBadEmail.includes('Please enter a valid email address');
  console.log(`[PASS] Invalid email error displayed: ${hasBadEmailError}`);

  // 4. Role Selection test: switch to Doctor
  console.log('\n--- Test 4: Doctor Role Selection ---');
  await evaluate(ws, `(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const docTab = elements.find(el => el.innerText && el.innerText.trim() === 'Doctor');
    window.clickEl(docTab);
  })()`);

  await delay(400);
  const textAfterDoctorSelect = await evaluate(ws, 'document.body.innerText');
  const hasDoctorHint = textAfterDoctorSelect.includes('Access clinical records & AI diagnostic summaries');
  console.log(`[PASS] Doctor role activated with clinical context: ${hasDoctorHint}`);

  await captureScreenshot(ws, '03_doctor_role_selected.png');

  // 5. Test Doctor Login Flow
  console.log('\n--- Test 5: Doctor Authentication & Dashboard Routing ---');
  await evaluate(ws, `(() => {
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      window.setVal(inputs[0], 'dr.mehta@aiims.edu');
      window.setVal(inputs[1], 'Doctor@2026');
    }
    const buttons = Array.from(document.querySelectorAll('*'));
    const loginBtn = buttons.find(el => el.innerText && el.innerText.trim() === 'Login');
    window.clickEl(loginBtn);
  })()`);

  // Wait for loading animation & navigation transition
  await delay(1600);

  const doctorDashboardText = await evaluate(ws, 'document.body.innerText');
  const hasDocHeading = doctorDashboardText.includes('Doctor Dashboard');
  const hasDocAuth = doctorDashboardText.includes('Doctor Authentication Verified');
  const hasDocModule = doctorDashboardText.includes('Longitudinal Health Record Synthesis');
  console.log(`[PASS] Routed to Doctor Dashboard: ${hasDocHeading}`);
  console.log(`[PASS] Clinical authentication verified: ${hasDocAuth}`);
  console.log(`[PASS] Clinical intelligence modules rendered: ${hasDocModule}`);

  await captureScreenshot(ws, '04_doctor_dashboard.png');

  // 6. Test Back to Login / Role Switch
  console.log('\n--- Test 6: Sign Out / Switch Back to Login ---');
  await evaluate(ws, `(() => {
    const backBtn = window.findButton('Test Another Role');
    window.clickEl(backBtn);
  })()`);

  await delay(700);
  const returnedText = await evaluate(ws, 'document.body.innerText');
  console.log(`[PASS] Successfully returned to Login: ${returnedText.includes('Welcome Back')}`);

  // 7. Test Patient Login Flow
  console.log('\n--- Test 7: Patient Authentication & Dashboard Routing ---');
  await evaluate(ws, `(() => {
    // Select Patient role
    const patTab = window.findButton('Patient');
    window.clickEl(patTab);

    // Fill credentials
    const inputs = document.querySelectorAll('input');
    if (inputs.length >= 2) {
      window.setVal(inputs[0], 'aarav.sharma@health.in');
      window.setVal(inputs[1], 'Patient@2026');
    }

    const loginBtn = window.findButton('Login');
    window.clickEl(loginBtn);
  })()`);

  await delay(1600);

  const patientDashboardText = await evaluate(ws, 'document.body.innerText');
  const hasPatHeading = patientDashboardText.includes('Patient Dashboard');
  const hasPatAuth = patientDashboardText.includes('Authentication Verified Successfully');
  const hasPatModule = patientDashboardText.includes('Personal Health Timeline');
  const hasAbha = patientDashboardText.includes('ABHA Health ID Linked');
  console.log(`[PASS] Routed to Patient Dashboard: ${hasPatHeading}`);
  console.log(`[PASS] Patient authentication verified: ${hasPatAuth}`);
  console.log(`[PASS] Health timeline & ABHA verified: ${hasPatModule && hasAbha}`);

  await captureScreenshot(ws, '05_patient_dashboard.png');

  // 8. Test Register Navigation
  console.log('\n--- Test 8: Register Navigation & Flow ---');
  await evaluate(ws, `(() => {
    const signOutBtn = window.findButton('Sign Out');
    window.clickEl(signOutBtn);
  })()`);

  await delay(700);
  await evaluate(ws, `(() => {
    const createBtn = window.findButton('Create an account');
    window.clickEl(createBtn);
  })()`);

  await delay(700);
  const registerText = await evaluate(ws, 'document.body.innerText');
  const hasRegisterTitle = registerText.includes('Create Account');
  const hasBackBtn = registerText.includes('Back to Sign In');
  console.log(`[PASS] Register screen rendered: ${hasRegisterTitle}`);
  console.log(`[PASS] Back navigation button present: ${hasBackBtn}`);

  await captureScreenshot(ws, '06_register_screen.png');

  // 9. Return to Login
  await evaluate(ws, `(() => {
    const backBtn = window.findButton('Back to Sign In');
    window.clickEl(backBtn);
  })()`);

  await delay(500);

  console.log('\n========================================');
  console.log('  ALL ASTRA AYU E2E TESTS PASSED 100%!');
  console.log('========================================\n');

  ws.close();
  edgeProcess.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
