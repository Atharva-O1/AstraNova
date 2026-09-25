export type UserRole = 'patient' | 'doctor';

export interface LoginFormState {
  identifier: string; // Email or Mobile Number
  password: string;
  role: UserRole;
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export type RootRoute =
  | 'Login'
  | 'Register'
  | 'PatientDashboard'
  | 'DoctorDashboard'
  | 'DoctorPatients'
  | 'PatientDetail'
  | 'EvidenceViewer';

export type PatientDetailTab = 'overview' | 'timeline' | 'ai-search' | 'records';

export interface RouteParams {
  role?: UserRole;
  userIdentifier?: string;
  userName?: string;
  patientId?: string;
  activeTab?: PatientDetailTab;
  recordId?: string;
  searchQuery?: string;
  highlightText?: string;
  sourceScreen?: RootRoute;
}
