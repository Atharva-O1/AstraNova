import { UserRole } from './auth';

export type PatientHealthStatus = 'Stable' | 'Follow-up Required' | 'Review Pending';

export interface PatientDemographics {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  abhaId: string;
  phone: string;
  email: string;
  status: PatientHealthStatus;
  lastActivity: string;
  lastRecordName: string;
  allergies: string[];
  chronicConditions: string[];
  primaryDoctorId: string;
  vitals?: {
    bloodPressure?: string;
    pulseRate?: string;
    oxygenSaturation?: string;
    temperature?: string;
    weightKg?: number;
  };
}

export type TimelineEventType = 'report' | 'visit' | 'prescription';

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  isoDate: string;
  title: string;
  type: TimelineEventType;
  summary: string;
  doctor: string;
  hospital: string;
  associatedRecordId?: string;
  badgeLabel?: string;
}

export type MedicalRecordType =
  | 'Lab Report'
  | 'Doctor Consultation'
  | 'Prescription'
  | 'Radiology';

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  documentName: string;
  documentType: MedicalRecordType;
  date: string;
  doctor: string;
  hospital: string;
  status: 'Extracted & Verified' | 'OCR Processed';
  fileUrl?: string;
  extractedText: string;
  structuredData?: Record<string, string | number>;
  keyFindings: string[];
  medicines?: PrescribedMedicine[];
  clinicalNotes?: string;
  pageNumber?: number;
}

export interface AISearchEvidence {
  documentId: string;
  documentName: string;
  documentType: MedicalRecordType;
  date: string;
  hospital: string;
  doctor: string;
  snippet: string;
  keyFindings: string[];
}

export interface AISearchResult {
  query: string;
  patientId: string;
  patientName: string;
  answer: string;
  confidence: number;
  hasEvidence: boolean;
  evidence: AISearchEvidence | null;
  clinicalInterpretation?: string;
  timestamp: string;
}

export interface DoctorDashboardStats {
  totalPatients: number;
  recentRecordsCount: number;
  pendingReviewsCount: number;
  todayActivityCount: number;
}
