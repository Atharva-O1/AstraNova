# ASTRA AYU 🏥✨
> **“Your Health. Organized. Connected.”**
> *SIH 2026 Mobile UI Prototype — Personal Health Intelligence Platform*

Astra Ayu organizes longitudinal patient medical records, constructs a chronological health timeline, and provides AI-powered natural language search with evidence-backed citations.

This repository implements the first mobile UI prototype: the **Astra Ayu Authentication Experience** with role-based entry for **Patients** and **Doctors**.

---

## 📱 Features & Implemented Flow

### 1. Top Branding & Healthcare-Tech Identity
* **Brand Header**: Displays **ASTRA AYU** with healthcare-tech typography and letter spacing.
* **Tagline**: *“Your Health. Organized. Connected.”*
* **AI Visual Element**: Minimalist interconnected neural health-pulse symbol representing AI intelligence layered over medical telemetry.
* **Vision Badge**: "Personal Health Intelligence Platform" indicator.

### 2. Welcome & Typography
* **Welcome Back** with clean subtitles, spacious layout, and accessible slate typography.

### 3. Role Selector (`Patient` | `Doctor`)
* Compact, responsive role switcher with active states and contextual explanations:
  * **Patient**: *"Access your personal health timeline & AI search"*
  * **Doctor**: *"Access clinical records & AI diagnostic summaries"*
* Smooth single-screen role toggling (no redundant pages).

### 4. Input Fields & Client-side Validation
* **Email or Mobile Number**:
  * Mail/phone icon, clear label, focus highlight.
  * Validation: empty field checks, RFC-compliant email checks, and 10-digit mobile number checks.
* **Password Field**:
  * Lock icon, clear label, focus highlight.
  * Toggle password visibility (`eye` / `eye-off`).
  * Minimum length validation.

### 5. Forgot Password Dialog
* Dedicated secondary action opening a modal with registered contact input, recovery dispatch feedback, and instructions.

### 6. Primary Login & Simulation
* Prominent teal primary button (`#0D9488`).
* Accessible touch target (`>= 50px`).
* Realistic simulated authentication spinner (`Authenticating...`).
* Role-based routing:
  * Patient credentials → **Patient Dashboard** (`Personal Health Timeline`, `ABHA Health ID Linked`, `AI Natural Language Health Search`).
  * Doctor credentials → **Doctor Dashboard** (`MCI Council Registration`, `Longitudinal Health Record Synthesis`, `AI Differential & Evidence Citation`).
* Quick-fill demo button included for rapid SIH evaluation.

### 7. Registration Flow
* "New to Astra Ayu? Create an account" navigation.
* Registration screen with role selection, full name, contact, password confirmation, and back navigation.

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── AuthLayout.tsx           # Responsive container (mobile + desktop preview)
│   ├── BrandHeader.tsx          # ASTRA AYU branding + AI health pulse icon
│   ├── ForgotPasswordModal.tsx  # Password recovery dialog
│   ├── InputField.tsx           # Rounded text input with clear button & validation
│   ├── PasswordField.tsx        # Password input with visibility toggle
│   ├── PrimaryButton.tsx        # Accessible primary button with loading state
│   └── RoleSelector.tsx         # Compact Patient / Doctor toggle
├── navigation/
│   └── NavigationContext.tsx    # Typed, zero-dependency stack router
├── screens/
│   ├── LoginScreen.tsx          # Core authentication screen
│   ├── RegisterScreen.tsx       # Placeholder onboarding screen
│   ├── PatientDashboardScreen.tsx # Patient portal destination
│   └── DoctorDashboardScreen.tsx  # Clinical doctor portal destination
├── theme/
│   └── colors.ts                # Healthcare teal & slate design tokens
└── types/
    └── auth.ts                  # TypeScript types for roles, credentials & routes
```

---

## 🎨 Visual Design Direction

* **Color Palette**:
  * Primary: Modern Teal (`#0D9488` / `#0F766E`)
  * Tints: Clean Teal Tint (`#F0FDFA` / `#CCFBF1`)
  * Clinical Accent: Sky (`#0284C7` / `#E0F2FE`)
  * Neutral Surfaces: Slate 50 (`#F8FAFC`), White Card (`#FFFFFF`), Border (`#E2E8F0`)
  * Typography: Slate 900 (`#0F172A`), Slate 600 (`#475569`)
* **Design Philosophy**: Trust + Healthcare + AI + Simplicity (No excessive gradients, no hospital-drab aesthetics).

---

## 🚀 Running the Application

### Prerequisites
* Node.js 18+ (tested on Node v26)
* npm

### Install Dependencies
```bash
npm install
```

### Run with Expo
```bash
# Start development server
npm run web
# Or for mobile devices via Expo Go
npm start
```

### Run Static Demo Server
```bash
npm run build:web
npm run serve
# Access at http://localhost:8085
```

### Run Automated E2E Test Suite
The automated test suite runs in headless mode using Chrome DevTools Protocol (CDP), testing all 8 scenarios and capturing high-resolution verification screenshots:
```bash
npm run test:e2e
```
