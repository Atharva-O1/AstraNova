import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RootRoute, RouteParams } from '../types/auth';

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
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([
    { route: 'Login', params: { role: 'patient' } },
  ]);

  const currentItem = history[history.length - 1];

  const navigate = (route: RootRoute, params?: RouteParams) => {
    setHistory((prev) => [...prev, { route, params }]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute: currentItem.route,
        params: currentItem.params || {},
        navigate,
        goBack,
        canGoBack: history.length > 1,
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
