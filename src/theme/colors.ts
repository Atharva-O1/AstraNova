export const colors = {
  primary: '#0D9488', // Modern healthcare teal
  primaryDark: '#0F766E', // Deeper teal for active states/gradients
  primaryLight: '#CCFBF1', // Soft teal badge / highlight
  primarySubtle: '#F0FDFA', // Clean teal background tint
  primaryGradient: ['#0F766E', '#14B8A6'] as const,

  // Clinical / Doctor Accent
  doctorPrimary: '#0284C7',
  doctorLight: '#E0F2FE',
  doctorSubtle: '#F0F9FF',

  // Neutrals & Surfaces
  background: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Slate 100
  border: '#E2E8F0', // Slate 200
  borderFocus: '#0D9488',
  borderError: '#EF4444',

  // Typography
  textPrimary: '#0F172A', // Slate 900 - high contrast readability
  textSecondary: '#475569', // Slate 600 - comfortable readability
  textMuted: '#94A3B8', // Slate 400 - placeholders
  textInverse: '#FFFFFF',

  // Feedback states
  error: '#EF4444',
  errorBackground: '#FEF2F2',
  errorBorder: '#FCA5A5',
  success: '#10B981',
  successBackground: '#ECFDF5',
  warning: '#F59E0B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  button: {
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
};
