import React, { createContext, useContext, useState, useEffect } from 'react';

interface PasswordContextType {
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'Sercade2026';
const STORAGE_KEY = 'convivencia_auth';

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticate = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PasswordContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </PasswordContext.Provider>
  );
}

export function usePassword() {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePassword must be used within PasswordProvider');
  }
  return context;
}
