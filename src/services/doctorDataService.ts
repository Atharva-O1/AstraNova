import {
  PatientDemographics,
  TimelineEvent,
  MedicalRecord,
  DoctorDashboardStats,
} from '../types/doctor';

// Realistic Dummy Patients for SIH 2026 Astra Ayu Prototype
const DUMMY_PATIENTS: PatientDemographics[] = [
  {
    id: 'P-1024',
    name: 'Rahul Sharma',
    age: 24,
    gender: 'Male',
    bloodGroup: 'B+',
    abhaId: '91-4829-1049-5832',
    phone: '+91 98201 44521',
    email: 'rahul.sharma@health.in',
    status: 'Follow-up Required',
    lastActivity: '12 Mar 2026',
    lastRecordName: 'CBC Report',
    allergies: ['Penicillin (Mild urticaria/rash)'],
    chronicConditions: ['Mild Microcytic Hypochromic Anemia'],
    primaryDoctorId: 'dr.mehta@aiims.edu',
    vitals: {
      bloodPressure: '118/76 mmHg',
      pulseRate: '78 bpm',
      oxygenSaturation: '99%',
      temperature: '98.4 °F',
      weightKg: 68,
    },
  },
  {
    id: 'P-1041',
    name: 'Priya Patil',
    age: 38,
    gender: 'Female',
    bloodGroup: 'O+',
    abhaId: '91-8841-3921-7712',
    phone: '+91 97114 88302',
    email: 'priya.patil@health.in',
    status: 'Stable',
    lastActivity: '09 Mar 2026',
    lastRecordName: 'Thyroid Function Test',
    allergies: ['Sulfa drugs (Moderate itching)'],
    chronicConditions: ['Subclinical Hypothyroidism'],
    primaryDoctorId: 'dr.mehta@aiims.edu',
    vitals: {
      bloodPressure: '122/80 mmHg',
      pulseRate: '72 bpm',
      oxygenSaturation: '98%',
      temperature: '98.6 °F',
      weightKg: 64,
    },
  },
  {
    id: 'P-1088',
    name: 'Aman Verma',
    age: 52,
    gender: 'Male',
    bloodGroup: 'A+',
    abhaId: '91-3012-9943-1829',
    phone: '+91 98402 11983',
    email: 'aman.verma@health.in',
    status: 'Review Pending',
    lastActivity: '28 Feb 2026',
    lastRecordName: 'Diabetic & Metabolic Panel',
    allergies: ['None known'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Mild Dyslipidemia'],
    primaryDoctorId: 'dr.mehta@aiims.edu',
    vitals: {
      bloodPressure: '130/84 mmHg',
      pulseRate: '80 bpm',
      oxygenSaturation: '98%',
      temperature: '98.2 °F',
      weightKg: 79,
    },
  },
];

// Realistic Timeline Events for Patients
const DUMMY_TIMELINE: Record<string, TimelineEvent[]> = {
  'P-1024': [
    {
      id: 'EVT-1024-01',
      patientId: 'P-1024',
      date: '12 Mar 2026',
      isoDate: '2026-03-12',
      title: 'CBC Blood Test',
      type: 'report',
      summary: 'Hemoglobin: 10.2 g/dL (Below normal reference 13.5–17.5 g/dL)',
      doctor: 'Dr. Arvind Kulkarni',
      hospital: 'City Hospital Laboratory',
      associatedRecordId: 'REC-1024-01',
      badgeLabel: 'Lab Report',
    },
    {
      id: 'EVT-1024-02',
      patientId: 'P-1024',
      date: '05 Mar 2026',
      isoDate: '2026-03-05',
      title: 'Doctor Visit',
      type: 'visit',
      summary: 'General consultation for persistent fatigue, pallor, and occasional lightheadedness',
      doctor: 'Dr. Arvind Kulkarni',
      hospital: 'City Hospital OPD',
      associatedRecordId: 'REC-1024-03',
      badgeLabel: 'OPD Consultation',
    },
    {
      id: 'EVT-1024-03',
      patientId: 'P-1024',
      date: '05 Mar 2026',
      isoDate: '2026-03-05',
      title: 'Prescription Issued',
      type: 'prescription',
      summary: 'Iron supplementation & Folic Acid prescribed for 30 days',
      doctor: 'Dr. Arvind Kulkarni',
      hospital: 'City Hospital OPD',
      associatedRecordId: 'REC-1024-02',
      badgeLabel: 'Prescription',
    },
    {
      id: 'EVT-1024-04',
      patientId: 'P-1024',
      date: '10 Jan 2025',
      isoDate: '2025-01-10',
      title: 'Annual Health Screening',
      type: 'report',
      summary: 'Baseline wellness screening. Hemoglobin was 14.1 g/dL (Normal).',
      doctor: 'Dr. S. Ramanathan',
      hospital: 'Apollo Health Clinic',
      associatedRecordId: 'REC-1024-04',
      badgeLabel: 'Annual Checkup',
    },
  ],
  'P-1041': [
    {
      id: 'EVT-1041-01',
      patientId: 'P-1041',
      date: '09 Mar 2026',
      isoDate: '2026-03-09',
      title: 'Thyroid Function Profile',
      type: 'report',
      summary: 'TSH: 6.80 µIU/mL (High). Subclinical hypothyroidism detected.',
      doctor: 'Dr. Sneha Rao',
      hospital: 'Metropolis Diagnostic Center',
      associatedRecordId: 'REC-1041-01',
      badgeLabel: 'Lab Report',
    },
    {
      id: 'EVT-1041-02',
      patientId: 'P-1041',
      date: '09 Mar 2026',
      isoDate: '2026-03-09',
      title: 'Prescription Issued',
      type: 'prescription',
      summary: 'Thyroxine Sodium 25 mcg once daily empty stomach',
      doctor: 'Dr. Sneha Rao',
      hospital: 'Fortis Healthcare OPD',
      associatedRecordId: 'REC-1041-02',
      badgeLabel: 'Prescription',
    },
    {
      id: 'EVT-1041-03',
      patientId: 'P-1041',
      date: '01 Mar 2026',
      isoDate: '2026-03-01',
      title: 'Endocrinology Consultation',
      type: 'visit',
      summary: 'Presented with lethargy, cold sensitivity, and mild weight gain',
      doctor: 'Dr. Sneha Rao',
      hospital: 'Fortis Healthcare',
      associatedRecordId: 'REC-1041-03',
      badgeLabel: 'Specialist Visit',
    },
  ],
  'P-1088': [
    {
      id: 'EVT-1088-01',
      patientId: 'P-1088',
      date: '28 Feb 2026',
      isoDate: '2026-02-28',
      title: 'Diabetic & Metabolic Panel',
      type: 'report',
      summary: 'HbA1c: 7.8% (Elevated), Fasting Blood Glucose: 156 mg/dL',
      doctor: 'Dr. Rajesh Gupta',
      hospital: 'Apex Diagnostic Laboratories',
      associatedRecordId: 'REC-1088-01',
      badgeLabel: 'Lab Report',
    },
    {
      id: 'EVT-1088-02',
      patientId: 'P-1088',
      date: '28 Feb 2026',
      isoDate: '2026-02-28',
      title: 'Prescription Issued',
      type: 'prescription',
      summary: 'Metformin ER 500mg BD + Atorvastatin 10mg HS',
      doctor: 'Dr. Rajesh Gupta',
      hospital: 'Max Super Speciality OPD',
      associatedRecordId: 'REC-1088-02',
      badgeLabel: 'Prescription',
    },
    {
      id: 'EVT-1088-03',
      patientId: 'P-1088',
      date: '15 Jan 2026',
      isoDate: '2026-01-15',
      title: 'Cardiology ECG & Lipid Profile',
      type: 'report',
      summary: 'Normal Sinus Rhythm, Total Cholesterol: 220 mg/dL, LDL: 142 mg/dL',
      doctor: 'Dr. Vikram Seth',
      hospital: 'Apollo Heart Institute',
      associatedRecordId: 'REC-1088-03',
      badgeLabel: 'Cardiology',
    },
  ],
};

// Detailed Medical Records for Patients
const DUMMY_RECORDS: Record<string, MedicalRecord[]> = {
  'P-1024': [
    {
      id: 'REC-1024-01',
      patientId: 'P-1024',
      documentName: 'Complete Blood Count (CBC) Report',
      documentType: 'Lab Report',
      date: '12 March 2026',
      doctor: 'Dr. Arvind Kulkarni (Consultant Pathologist)',
      hospital: 'City Hospital Laboratory',
      status: 'Extracted & Verified',
      fileUrl: 'https://records.astraayu.health/patients/p-1024/cbc-mar-2026.pdf',
      pageNumber: 1,
      structuredData: {
        'Hemoglobin (Hb)': '10.2 g/dL',
        'RBC Count': '4.10 million/µL',
        'Packed Cell Volume (PCV)': '32.4 %',
        'Mean Corpuscular Volume (MCV)': '79.0 fL',
        'Mean Corpuscular Hb (MCH)': '24.8 pg',
        'Platelet Count': '2.40 lakh/µL',
        'Total Leukocyte Count (WBC)': '7,800 /µL',
        'Neutrophils': '62 %',
        'Lymphocytes': '30 %',
      },
      keyFindings: [
        'Hemoglobin: 10.2 g/dL (Below adult male normal range 13.5–17.5 g/dL)',
        'MCV: 79.0 fL (Microcytosis detected; normal range 80–100 fL)',
        'MCH: 24.8 pg (Hypochromia detected; normal range 27–33 pg)',
        'Normal leukocyte count (7,800 /µL) with no toxic granulation',
        'Adequate platelets (2.4 lakh /µL) without clumps',
      ],
      extractedText:
        'INVESTIGATION: Complete Blood Count (CBC) with Automated Differential.\n' +
        'PATIENT: Rahul Sharma | AGE/SEX: 24 Y / Male | REF BY: Dr. Arvind Kulkarni\n' +
        'HOSPITAL: City Hospital Central Laboratory | ACC NO: CH-LAB-2026-9042\n' +
        'RESULTS:\n' +
        '• Hemoglobin: 10.2 g/dL [Reference Range: 13.5 - 17.5 g/dL - LOW]\n' +
        '• Total RBC Count: 4.10 mil/uL [Reference Range: 4.5 - 5.9 mil/uL - LOW]\n' +
        '• Packed Cell Volume (PCV): 32.4 % [Reference Range: 40.0 - 50.0 % - LOW]\n' +
        '• MCV: 79.0 fL [Reference Range: 80.0 - 100.0 fL - LOW]\n' +
        '• MCH: 24.8 pg [Reference Range: 27.0 - 33.0 pg - LOW]\n' +
        '• MCHC: 31.5 g/dL [Reference Range: 31.5 - 35.0 g/dL - Normal]\n' +
        '• Platelet Count: 2.40 Lakh/cumm [Reference Range: 1.5 - 4.5 Lakh/cumm - Normal]\n' +
        '• Total Leukocyte Count (TLC): 7,800 /cumm [Reference Range: 4,000 - 11,000 - Normal]\n' +
        'IMPRESSION: Peripheral blood smear shows microcytic hypochromic red blood cells with mild anisopoikilocytosis. Features consistent with mild Iron Deficiency Anemia. Recommend serum ferritin evaluation and clinical correlation.',
      clinicalNotes:
        'Patient reports mild fatigue during physical workouts. Mild conjunctival pallor noted. Stool routine negative for occult blood.',
    },
    {
      id: 'REC-1024-02',
      patientId: 'P-1024',
      documentName: 'Prescription & Therapeutic Plan',
      documentType: 'Prescription',
      date: '05 March 2026',
      doctor: 'Dr. Arvind Kulkarni (Internal Medicine)',
      hospital: 'City Hospital OPD',
      status: 'Extracted & Verified',
      fileUrl: 'https://records.astraayu.health/patients/p-1024/rx-mar-2026.pdf',
      pageNumber: 1,
      medicines: [
        {
          name: 'Tab. Ferrous Ascorbate',
          dosage: '100 mg',
          frequency: 'Once Daily (OD)',
          duration: '30 Days',
          purpose: 'Oral iron supplementation (Take post-lunch with water)',
        },
        {
          name: 'Tab. Folic Acid',
          dosage: '5 mg',
          frequency: 'Once Daily (OD)',
          duration: '30 Days',
          purpose: 'Support erythropoiesis and folate levels',
        },
        {
          name: 'Tab. Vitamin C (Ascorbic Acid)',
          dosage: '500 mg',
          frequency: 'Once Daily (OD)',
          duration: '30 Days',
          purpose: 'Enhance gastrointestinal iron absorption',
        },
      ],
      keyFindings: [
        'Oral iron repletion therapy initiated for suspected nutritional anemia',
        'Dietary counseling: high iron-rich foods (spinach, lentils, dates, jaggery)',
        'Avoid calcium supplements or tea within 2 hours of iron intake',
        'Follow-up visit with repeat CBC in 4 weeks',
      ],
      extractedText:
        'PRESCRIPTION SLIP\n' +
        'CITY HOSPITAL INTERNAL MEDICINE OPD\n' +
        'Patient: Rahul Sharma | Age: 24 | Date: 05-03-2026\n' +
        'Rx:\n' +
        '1. Tab. Ferrous Ascorbate 100mg - 1 tablet OD after lunch x 30 days\n' +
        '2. Tab. Folic Acid 5mg - 1 tablet OD morning x 30 days\n' +
        '3. Tab. Vitamin C 500mg - 1 tablet OD with iron tablet x 30 days\n' +
        'Advice: Order CBC + S. Ferritin. Avoid milk/tea with iron tablet. Review after 1 month.',
      clinicalNotes: 'Initiated empirical iron therapy pending CBC lab confirmation.',
    },
    {
      id: 'REC-1024-03',
      patientId: 'P-1024',
      documentName: 'General OPD Consultation Note',
      documentType: 'Doctor Consultation',
      date: '05 March 2026',
      doctor: 'Dr. Arvind Kulkarni',
      hospital: 'City Hospital OPD',
      status: 'Extracted & Verified',
      keyFindings: [
        'History: Exertional fatigue, lassitude, and mild dizziness for 3 weeks',
        'Physical exam: Conjunctival pallor +, No koilonychia or jaundice',
        'Vitals: BP 118/76 mmHg, Pulse 78/min regular, SpO2 99% room air',
        'Provisional Diagnosis: Nutritional Deficiency Anemia',
      ],
      extractedText:
        'CLINICAL SUMMARY NOTE - OPD\n' +
        'Patient presents with gradually worsening fatigue and breathlessness upon climbing stairs for 3 weeks.\n' +
        'Diet: predominantly vegetarian, irregular meal patterns.\n' +
        'O/E: Conscious, alert. Pallor present in lower palpebral conjunctiva. Tongue normal, no glossitis.\n' +
        'CVS: S1 S2 heard, no murmur. RS: Clear. P/A: Soft, non-tender, no organomegaly.\n' +
        'Impression: Anemia under evaluation. Plan: CBC, Iron profile, start oral supplements.',
    },
    {
      id: 'REC-1024-04',
      patientId: 'P-1024',
      documentName: 'Baseline Health Checkup Summary',
      documentType: 'Lab Report',
      date: '10 January 2025',
      doctor: 'Dr. S. Ramanathan',
      hospital: 'Apollo Health Clinic',
      status: 'Extracted & Verified',
      structuredData: {
        'Hemoglobin': '14.1 g/dL',
        'Fasting Blood Sugar': '88 mg/dL',
        'Total Cholesterol': '164 mg/dL',
        'Serum Creatinine': '0.9 mg/dL',
      },
      keyFindings: [
        'Hemoglobin 14.1 g/dL within optimal healthy reference range',
        'Normal metabolic, renal, and liver panels',
        'No prior history of hematological abnormalities',
      ],
      extractedText:
        'APOLLO ANNUAL HEALTH PROFILE - 10-01-2025\n' +
        'Hemoglobin: 14.1 g/dL (Normal). Fasting Glucose: 88 mg/dL. Normal renal and hepatic parameters.\n' +
        'All baseline biomarkers within standard clinical limits.',
    },
  ],
  'P-1041': [
    {
      id: 'REC-1041-01',
      patientId: 'P-1041',
      documentName: 'Thyroid Function Profile (TSH, FT3, FT4)',
      documentType: 'Lab Report',
      date: '09 March 2026',
      doctor: 'Dr. Sneha Rao (Endocrinologist)',
      hospital: 'Metropolis Diagnostic Center',
      status: 'Extracted & Verified',
      structuredData: {
        'TSH (Ultrasensitive)': '6.80 µIU/mL',
        'Free T4': '1.15 ng/dL',
        'Free T3': '2.80 pg/mL',
      },
      keyFindings: [
        'TSH: 6.80 µIU/mL (High; normal adult range 0.40–4.20 µIU/mL)',
        'Free T4 and Free T3 within normal reference limits',
        'Consistent with Subclinical Hypothyroidism',
      ],
      extractedText:
        'METROPOLIS DIAGNOSTICS - THYROID EVALUATION\n' +
        'TSH: 6.80 uIU/mL [Normal: 0.40 - 4.20 uIU/mL - HIGH]\n' +
        'Free T4: 1.15 ng/dL [Normal: 0.80 - 1.80 ng/dL]\n' +
        'Free T3: 2.80 pg/mL [Normal: 2.0 - 4.4 pg/mL]\n' +
        'Impression: Subclinical Hypothyroidism. Correlate with clinical symptoms.',
    },
    {
      id: 'REC-1041-02',
      patientId: 'P-1041',
      documentName: 'Endocrinology Prescription',
      documentType: 'Prescription',
      date: '09 March 2026',
      doctor: 'Dr. Sneha Rao',
      hospital: 'Fortis Healthcare OPD',
      status: 'Extracted & Verified',
      medicines: [
        {
          name: 'Tab. Thyroxine Sodium (Thyronorm)',
          dosage: '25 mcg',
          frequency: 'Once Daily (OD)',
          duration: '90 Days',
          purpose: 'Thyroid hormone replacement (Empty stomach with water at least 30m before breakfast)',
        },
      ],
      keyFindings: [
        'Started low dose Levothyroxine 25 mcg OD for symptomatic subclinical hypothyroidism',
        'Repeat serum TSH after 8 to 12 weeks to monitor response',
      ],
      extractedText:
        'FORTIS HEALTHCARE - ENDOCRINOLOGY RX\n' +
        'Patient: Priya Patil | Date: 09-03-2026\n' +
        'Rx: Tab. Thyroxine Sodium 25 mcg OD in the morning empty stomach x 90 days.\n' +
        'Advice: Re-check TSH in 8 weeks.',
    },
    {
      id: 'REC-1041-03',
      patientId: 'P-1041',
      documentName: 'Endocrinology Clinical Evaluation',
      documentType: 'Doctor Consultation',
      date: '01 March 2026',
      doctor: 'Dr. Sneha Rao',
      hospital: 'Fortis Healthcare',
      status: 'Extracted & Verified',
      keyFindings: [
        'Complaints of sluggishness, cold intolerance, and 3 kg weight gain over 4 months',
        'Thyroid gland: normal size, no goitre or palpable nodule',
      ],
      extractedText:
        'Clinical notes: Patient complains of chronic fatigue and dry skin. Ordered Thyroid Panel.',
    },
  ],
  'P-1088': [
    {
      id: 'REC-1088-01',
      patientId: 'P-1088',
      documentName: 'Diabetic & Metabolic Profile (HbA1c & Glucose)',
      documentType: 'Lab Report',
      date: '28 February 2026',
      doctor: 'Dr. Rajesh Gupta (Diabetologist)',
      hospital: 'Apex Diagnostic Laboratories',
      status: 'Extracted & Verified',
      structuredData: {
        'HbA1c (HPLC)': '7.8 %',
        'Estimated Average Glucose': '177 mg/dL',
        'Fasting Blood Sugar (FBS)': '156 mg/dL',
        'Post-Prandial Glucose (PPBS)': '218 mg/dL',
      },
      keyFindings: [
        'HbA1c: 7.8% (Target < 7.0% for diabetic control)',
        'Fasting Blood Sugar: 156 mg/dL (High, normal < 100 mg/dL)',
        'Post-Prandial Glucose: 218 mg/dL (High, normal < 140 mg/dL)',
      ],
      extractedText:
        'APEX DIAGNOSTICS - DIABETIC PANEL\n' +
        'HbA1c: 7.8% [Ref: < 5.7% Normal, 5.7 - 6.4% Prediabetes, >= 6.5% Diabetes]\n' +
        'Fasting Blood Glucose: 156 mg/dL [Ref: 70 - 100 mg/dL - HIGH]\n' +
        'Post Prandial Glucose: 218 mg/dL [Ref: < 140 mg/dL - HIGH]\n' +
        'Impression: Uncontrolled Type 2 Diabetes Mellitus.',
    },
    {
      id: 'REC-1088-02',
      patientId: 'P-1088',
      documentName: 'Diabetology Clinical Prescription',
      documentType: 'Prescription',
      date: '28 February 2026',
      doctor: 'Dr. Rajesh Gupta',
      hospital: 'Max Super Speciality OPD',
      status: 'Extracted & Verified',
      medicines: [
        {
          name: 'Tab. Metformin Extended Release',
          dosage: '500 mg',
          frequency: 'Twice Daily (BD)',
          duration: '60 Days',
          purpose: 'Glycemic control (Take with breakfast and dinner)',
        },
        {
          name: 'Tab. Atorvastatin',
          dosage: '10 mg',
          frequency: 'Once Daily (HS)',
          duration: '60 Days',
          purpose: 'Lipid lowering and cardiovascular risk reduction',
        },
      ],
      keyFindings: [
        'Initiated Metformin ER 500mg twice daily with meals',
        'Prescribed Atorvastatin 10mg nightly for borderline dyslipidemia',
        'Target HbA1c < 7.0%; advise 30 mins brisk walking daily',
      ],
      extractedText:
        'MAX HEALTHCARE - RX SLIP\n' +
        'Rx: 1. Tab. Metformin ER 500mg BD with meals x 60 days.\n' +
        '2. Tab. Atorvastatin 10mg HS x 60 days.\n' +
        'Follow-up in 2 months with fasting & PP blood sugars.',
    },
    {
      id: 'REC-1088-03',
      patientId: 'P-1088',
      documentName: 'Cardiology ECG & Lipid Profile',
      documentType: 'Radiology',
      date: '15 January 2026',
      doctor: 'Dr. Vikram Seth',
      hospital: 'Apollo Heart Institute',
      status: 'Extracted & Verified',
      structuredData: {
        'ECG Interpretation': 'Normal Sinus Rhythm',
        'Heart Rate': '76 bpm',
        'Total Cholesterol': '220 mg/dL',
        'Triglycerides': '185 mg/dL',
        'HDL Cholesterol': '44 mg/dL',
        'LDL Cholesterol': '142 mg/dL',
      },
      keyFindings: [
        '12-lead ECG: Normal sinus rhythm, no ST-T segment elevation or ischemic changes',
        'Lipid Profile: Total Cholesterol 220 mg/dL, LDL 142 mg/dL (Mild hypercholesterolemia)',
      ],
      extractedText:
        'APOLLO CARDIOLOGY - 12-LEAD ECG & LIPIDS\n' +
        'Normal sinus rhythm, heart rate 76 bpm. PR interval 160ms. QRS 88ms.\n' +
        'Total Cholesterol: 220 mg/dL [Desirable < 200]. LDL: 142 mg/dL [Desirable < 100].\n' +
        'Impression: Borderline Dyslipidemia, ECG within normal limits.',
    },
  ],
};

// Data service implementation with authorization check
export class DoctorDataService {
  private static verifyDoctorRole(doctorId?: string): void {
    // In production, this verifies the JWT or session claims against authorized clinical doctor role
    if (!doctorId && doctorId !== undefined) {
      throw new Error('Access Denied: Doctor authorization credentials missing.');
    }
  }

  // Get all authorized patients assigned to this doctor
  public static async getAuthorizedPatients(doctorId: string = 'dr.mehta@aiims.edu'): Promise<PatientDemographics[]> {
    this.verifyDoctorRole(doctorId);
    // Simulate lightweight async database call
    await new Promise((resolve) => setTimeout(resolve, 80));
    return [...DUMMY_PATIENTS];
  }

  // Get patient profile by ID
  public static async getPatientById(
    patientId: string,
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<PatientDemographics | null> {
    this.verifyDoctorRole(doctorId);
    await new Promise((resolve) => setTimeout(resolve, 60));
    const patient = DUMMY_PATIENTS.find((p) => p.id === patientId);
    return patient ? { ...patient } : null;
  }

  // Get patient health timeline (reports, visits, prescriptions)
  public static async getPatientTimeline(
    patientId: string,
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<TimelineEvent[]> {
    this.verifyDoctorRole(doctorId);
    await new Promise((resolve) => setTimeout(resolve, 70));
    const events = DUMMY_TIMELINE[patientId] || [];
    return [...events].sort(
      (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
    );
  }

  // Get patient medical records
  public static async getPatientRecords(
    patientId: string,
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<MedicalRecord[]> {
    this.verifyDoctorRole(doctorId);
    await new Promise((resolve) => setTimeout(resolve, 80));
    return DUMMY_RECORDS[patientId] || [];
  }

  // Get single record by ID
  public static async getRecordById(
    recordId: string,
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<MedicalRecord | null> {
    this.verifyDoctorRole(doctorId);
    await new Promise((resolve) => setTimeout(resolve, 50));
    for (const pId in DUMMY_RECORDS) {
      const match = DUMMY_RECORDS[pId].find((r) => r.id === recordId);
      if (match) return { ...match };
    }
    return null;
  }

  // Get Doctor Dashboard summary statistics
  public static async getDashboardStats(
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<DoctorDashboardStats> {
    this.verifyDoctorRole(doctorId);
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      totalPatients: DUMMY_PATIENTS.length,
      recentRecordsCount: 5,
      pendingReviewsCount: 1,
      todayActivityCount: 2,
    };
  }
}
