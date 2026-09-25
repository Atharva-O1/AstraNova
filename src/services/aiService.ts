import { AISearchResult, AISearchEvidence } from '../types/doctor';
import { DoctorDataService } from './doctorDataService';

/**
 * AI Service for Astra Ayu Clinical Mode
 * Implements RAG (Retrieval-Augmented Generation) query interface for patient medical records.
 * Can be effortlessly connected to a real embedding/vector retrieval backend (e.g. pgvector, Pinecone, or LangChain).
 */
export class AIService {
  /**
   * Search a selected patient's longitudinal medical records using natural language.
   * Strictly scopes search to the patient's records and returns evidence citations.
   */
  public static async searchPatientHistory(
    patientId: string,
    query: string,
    doctorId: string = 'dr.mehta@aiims.edu'
  ): Promise<AISearchResult> {
    // 1. Simulate network and RAG pipeline delay (Query Embedding -> Vector Search -> Synthesis)
    await new Promise((resolve) => setTimeout(resolve, 650));

    // 2. Fetch the patient's authorized records
    const patient = await DoctorDataService.getPatientById(patientId, doctorId);
    const records = await DoctorDataService.getPatientRecords(patientId, doctorId);

    if (!patient) {
      return {
        query,
        patientId,
        patientName: 'Unknown Patient',
        answer: 'Patient authorization could not be verified or patient records are unavailable.',
        confidence: 0,
        hasEvidence: false,
        evidence: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    const cleanQuery = query.toLowerCase().trim();

    // RAG Intent Matching & Evidence Retrieval Scoped Strictly to Patient

    // --- CASE 1: Rahul Sharma (P-1024) ---
    if (patientId === 'P-1024') {
      const cbcRecord = records.find((r) => r.id === 'REC-1024-01');
      const rxRecord = records.find((r) => r.id === 'REC-1024-02');
      const opdRecord = records.find((r) => r.id === 'REC-1024-03');

      // Hemoglobin / CBC queries
      if (
        cleanQuery.includes('hemoglobin') ||
        cleanQuery.includes('hb') ||
        cleanQuery.includes('blood count') ||
        cleanQuery.includes('cbc') ||
        cleanQuery.includes('rbc') ||
        cleanQuery.includes('platelet')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `${patient.name}'s hemoglobin level was 10.2 g/dL on 12 March 2026 according to the Complete Blood Count (CBC) report from City Hospital Laboratory. This is below the normal male adult reference range of 13.5–17.5 g/dL and indicates mild microcytic hypochromic anemia.`,
          confidence: 0.96,
          hasEvidence: true,
          evidence: {
            documentId: cbcRecord?.id || 'REC-1024-01',
            documentName: cbcRecord?.documentName || 'Complete Blood Count (CBC) Report',
            documentType: 'Lab Report',
            date: '12 March 2026',
            hospital: 'City Hospital Laboratory',
            doctor: 'Dr. Arvind Kulkarni',
            snippet:
              'Hemoglobin: 10.2 g/dL [Reference Range: 13.5 - 17.5 g/dL - LOW]. Red Blood Cell Count: 4.10 mil/uL. PCV: 32.4%. MCV: 79.0 fL [LOW]. Platelet Count: 2.40 Lakh/cumm. IMPRESSION: Microcytic hypochromic red blood cells consistent with mild iron deficiency anemia.',
            keyFindings: [
              'Hemoglobin: 10.2 g/dL (Low)',
              'MCV: 79.0 fL (Microcytosis)',
              'MCH: 24.8 pg (Hypochromia)',
              'Platelets: 2.40 lakh/µL (Normal)',
            ],
          },
          clinicalInterpretation:
            'Findings suggest iron deficiency anemia. Follow-up ferritin and oral iron therapy recommended.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      // Medicines / Prescriptions
      if (
        cleanQuery.includes('medicine') ||
        cleanQuery.includes('medication') ||
        cleanQuery.includes('prescrib') ||
        cleanQuery.includes('tablet') ||
        cleanQuery.includes('supplement') ||
        cleanQuery.includes('iron') ||
        cleanQuery.includes('drug')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `On 05 March 2026, Dr. Arvind Kulkarni prescribed oral iron replacement therapy: Tab. Ferrous Ascorbate 100 mg (Once Daily, after lunch for 30 days), Tab. Folic Acid 5 mg (Once Daily for 30 days), and Tab. Vitamin C 500 mg (Once Daily for 30 days) to treat suspected nutritional iron deficiency.`,
          confidence: 0.94,
          hasEvidence: true,
          evidence: {
            documentId: rxRecord?.id || 'REC-1024-02',
            documentName: rxRecord?.documentName || 'Prescription & Therapeutic Plan',
            documentType: 'Prescription',
            date: '05 March 2026',
            hospital: 'City Hospital OPD',
            doctor: 'Dr. Arvind Kulkarni (Internal Medicine)',
            snippet:
              '1. Tab. Ferrous Ascorbate 100mg - 1 tab OD after lunch x 30 days\n2. Tab. Folic Acid 5mg - 1 tab OD morning x 30 days\n3. Tab. Vitamin C 500mg - 1 tab OD x 30 days\nAdvice: Avoid tea/milk within 2 hours of iron intake.',
            keyFindings: [
              'Ferrous Ascorbate 100 mg OD (30 Days)',
              'Folic Acid 5 mg OD (30 Days)',
              'Vitamin C 500 mg OD (30 Days)',
            ],
          },
          clinicalInterpretation:
            'Therapeutic regimen initiated for nutritional anemia. Check tolerance and compliance at 4-week review.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      // Anemia / Symptoms / Fatigue
      if (
        cleanQuery.includes('anemia') ||
        cleanQuery.includes('fatigue') ||
        cleanQuery.includes('tired') ||
        cleanQuery.includes('pallor') ||
        cleanQuery.includes('weakness')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `Records show ${patient.name} presented on 05 March 2026 with a 3-week history of exertional fatigue, pallor, and mild dizziness. Subsequent CBC testing on 12 March 2026 verified microcytic hypochromic anemia (Hemoglobin 10.2 g/dL, MCV 79.0 fL). Oral iron supplementation was initiated.`,
          confidence: 0.93,
          hasEvidence: true,
          evidence: {
            documentId: cbcRecord?.id || 'REC-1024-01',
            documentName: cbcRecord?.documentName || 'Complete Blood Count (CBC) Report',
            documentType: 'Lab Report',
            date: '12 March 2026',
            hospital: 'City Hospital Laboratory',
            doctor: 'Dr. Arvind Kulkarni',
            snippet:
              'IMPRESSION: Peripheral blood smear shows microcytic hypochromic red blood cells with mild anisopoikilocytosis. Features consistent with mild Iron Deficiency Anemia.',
            keyFindings: [
              'Documented history of 3-week exertional fatigue',
              'Confirmed Hb 10.2 g/dL with microcytic indices',
              'No gastrointestinal bleeding or weight loss reported',
            ],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      // Last blood test / dates
      if (
        cleanQuery.includes('last blood test') ||
        cleanQuery.includes('when was the last') ||
        cleanQuery.includes('last test') ||
        cleanQuery.includes('recent test') ||
        cleanQuery.includes('last visit')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `${patient.name}'s most recent blood test was a Complete Blood Count (CBC) conducted on 12 March 2026 at City Hospital Laboratory. Prior to that, an annual baseline checkup was recorded on 10 January 2025.`,
          confidence: 0.95,
          hasEvidence: true,
          evidence: {
            documentId: cbcRecord?.id || 'REC-1024-01',
            documentName: cbcRecord?.documentName || 'Complete Blood Count (CBC) Report',
            documentType: 'Lab Report',
            date: '12 March 2026',
            hospital: 'City Hospital Laboratory',
            doctor: 'Dr. Arvind Kulkarni',
            snippet: 'INVESTIGATION: Complete Blood Count (CBC) with Automated Differential. Specimen collected: 12-03-2026 08:30 AM.',
            keyFindings: ['Test Date: 12 March 2026', 'Status: Extracted & Verified'],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }

    // --- CASE 2: Priya Patil (P-1041) ---
    if (patientId === 'P-1041') {
      const thyroidRecord = records.find((r) => r.id === 'REC-1041-01');
      const rxRecord = records.find((r) => r.id === 'REC-1041-02');

      if (
        cleanQuery.includes('thyroid') ||
        cleanQuery.includes('tsh') ||
        cleanQuery.includes('t3') ||
        cleanQuery.includes('t4') ||
        cleanQuery.includes('hypothyroid')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `${patient.name}'s thyroid profile from 09 March 2026 showed an elevated serum TSH of 6.80 µIU/mL (normal range: 0.40–4.20 µIU/mL) with normal Free T4 (1.15 ng/dL) and Free T3 (2.8 pg/mL), indicating Subclinical Hypothyroidism.`,
          confidence: 0.95,
          hasEvidence: true,
          evidence: {
            documentId: thyroidRecord?.id || 'REC-1041-01',
            documentName: thyroidRecord?.documentName || 'Thyroid Function Profile',
            documentType: 'Lab Report',
            date: '09 March 2026',
            hospital: 'Metropolis Diagnostic Center',
            doctor: 'Dr. Sneha Rao',
            snippet:
              'TSH: 6.80 uIU/mL [Normal: 0.40 - 4.20 - HIGH]. Free T4: 1.15 ng/dL [0.80 - 1.80]. IMPRESSION: Subclinical Hypothyroidism.',
            keyFindings: ['TSH: 6.80 µIU/mL (High)', 'Free T4: 1.15 ng/dL (Normal)'],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      if (
        cleanQuery.includes('medicine') ||
        cleanQuery.includes('thyroxine') ||
        cleanQuery.includes('thyronorm') ||
        cleanQuery.includes('prescrib')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `On 09 March 2026, Dr. Sneha Rao prescribed Tab. Thyroxine Sodium (Thyronorm) 25 mcg once daily in the morning on an empty stomach for 90 days.`,
          confidence: 0.94,
          hasEvidence: true,
          evidence: {
            documentId: rxRecord?.id || 'REC-1041-02',
            documentName: rxRecord?.documentName || 'Endocrinology Prescription',
            documentType: 'Prescription',
            date: '09 March 2026',
            hospital: 'Fortis Healthcare OPD',
            doctor: 'Dr. Sneha Rao',
            snippet: 'Rx: Tab. Thyroxine Sodium 25 mcg OD in the morning empty stomach x 90 days.',
            keyFindings: ['Thyroxine Sodium 25 mcg OD', 'Duration: 90 Days'],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }

    // --- CASE 3: Aman Verma (P-1088) ---
    if (patientId === 'P-1088') {
      const diabeticRecord = records.find((r) => r.id === 'REC-1088-01');
      const rxRecord = records.find((r) => r.id === 'REC-1088-02');

      if (
        cleanQuery.includes('diabetes') ||
        cleanQuery.includes('sugar') ||
        cleanQuery.includes('glucose') ||
        cleanQuery.includes('hba1c') ||
        cleanQuery.includes('diabetic')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `${patient.name}'s diabetic panel on 28 February 2026 showed an HbA1c of 7.8% (target < 7.0%) and Fasting Blood Sugar of 156 mg/dL, indicating sub-optimally controlled Type 2 Diabetes Mellitus.`,
          confidence: 0.95,
          hasEvidence: true,
          evidence: {
            documentId: diabeticRecord?.id || 'REC-1088-01',
            documentName: diabeticRecord?.documentName || 'Diabetic & Metabolic Profile',
            documentType: 'Lab Report',
            date: '28 February 2026',
            hospital: 'Apex Diagnostic Laboratories',
            doctor: 'Dr. Rajesh Gupta',
            snippet:
              'HbA1c: 7.8% [Ref: < 5.7% Normal, >= 6.5% Diabetes]. Fasting Blood Glucose: 156 mg/dL [Ref: 70 - 100 mg/dL - HIGH]. IMPRESSION: Uncontrolled Type 2 Diabetes Mellitus.',
            keyFindings: ['HbA1c: 7.8% (Elevated)', 'Fasting Glucose: 156 mg/dL (High)'],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      if (
        cleanQuery.includes('medicine') ||
        cleanQuery.includes('metformin') ||
        cleanQuery.includes('atorvastatin') ||
        cleanQuery.includes('prescrib')
      ) {
        return {
          query,
          patientId,
          patientName: patient.name,
          answer: `On 28 February 2026, Dr. Rajesh Gupta prescribed Tab. Metformin Extended Release 500 mg twice daily with meals and Tab. Atorvastatin 10 mg once daily at bedtime for 60 days.`,
          confidence: 0.94,
          hasEvidence: true,
          evidence: {
            documentId: rxRecord?.id || 'REC-1088-02',
            documentName: rxRecord?.documentName || 'Diabetology Clinical Prescription',
            documentType: 'Prescription',
            date: '28 February 2026',
            hospital: 'Max Super Speciality OPD',
            doctor: 'Dr. Rajesh Gupta',
            snippet:
              '1. Tab. Metformin ER 500mg BD with meals x 60 days.\n2. Tab. Atorvastatin 10mg HS x 60 days.',
            keyFindings: [
              'Metformin ER 500mg BD',
              'Atorvastatin 10mg HS',
              'Duration: 60 Days',
            ],
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
    }

    // --- FALLBACK / NO EVIDENCE CASE ---
    // Grounding safeguard: Never hallucinate medical claims when patient records lack evidence.
    return {
      query,
      patientId,
      patientName: patient.name,
      answer: `I couldn't find enough information in ${patient.name}'s records to answer this question.`,
      confidence: 0.12,
      hasEvidence: false,
      evidence: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
