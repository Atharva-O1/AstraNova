import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RootRoute, RouteParams, UserRole } from '../types/auth';

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string;
}

interface NavigationHistoryItem {
  route: RootRoute;
  params?: RouteParams;
}

interface NavigationContextType {
  currentRoute: RootRoute;
  params: RouteParams;
  navigate: (route: RootRoute, params?: RouteParams) => void;
  goBack: () => void;
  canGoBack: boolean;
  currentUser: AuthenticatedUser | null;
  setCurrentUser: (user: AuthenticatedUser | null) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const DOCTOR_ONLY_ROUTES: RootRoute[] = [
  'DoctorDashboard',
  'DoctorPatients',
  'PatientDetail',
  'EvidenceViewer',
];

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([
    { route: 'Login', params: { role: 'patient' } },
  ]);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const currentItem = history[history.length - 1];

  const navigate = (route: RootRoute, params?: RouteParams) => {
    // If logging out to Login, reset user & clear errors
    if (route === 'Login') {
      setCurrentUser(null);
      setAuthError(null);
      setHistory([{ route: 'Login', params: params || { role: 'patient' } }]);
      return;
    }

    // Determine effective role from params or existing session
    const effectiveRole: UserRole | undefined =
      params?.role || currentUser?.role;

    // Role-based route protection: Doctor routes require doctor role
    if (DOCTOR_ONLY_ROUTES.includes(route)) {
      if (effectiveRole !== 'doctor') {
        setAuthError('Unauthorized: Access restricted to verified Medical Practitioners.');
        // Redirect or keep on safe screen
        if (effectiveRole === 'patient') {
          setHistory((prev) => [
            ...prev,
            {
              route: 'PatientDashboard',
              params: { role: 'patient', userName: currentUser?.name || 'Patient' },
            },
          ]);
        }
        return;
      }
    }

    // If logging in as doctor/patient, save user session
    if (params?.role && params?.userIdentifier) {
      setCurrentUser({
        id: params.userIdentifier,
        identifier: params.userIdentifier,
        name: params.userName || (params.role === 'doctor' ? 'Dr. Sarah Mehta' : 'Patient'),
        role: params.role,
      });
    }

    setAuthError(null);
    setHistory((prev) => [...prev, { route, params }]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute: currentItem.route,
        params: currentItem.params || {},
        navigate,
        goBack,
        canGoBack: history.length > 1,
        currentUser,
        setCurrentUser,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useAppNavigation must be used within a NavigationProvider');
  }
  return context;
};
