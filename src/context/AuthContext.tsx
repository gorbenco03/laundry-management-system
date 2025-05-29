import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { DEMO_CREDENTIALS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulare verificare credențiale (în producție ar fi un API call)
    if (username === DEMO_CREDENTIALS.EMPLOYEE.username && password === DEMO_CREDENTIALS.EMPLOYEE.password) {
      setUser({
        id: '1',
        username: username,
        role: UserRole.EMPLOYEE,
        name: 'Angajat Demo'
      });
      return true;
    } else if (username === DEMO_CREDENTIALS.ADMIN.username && password === DEMO_CREDENTIALS.ADMIN.password) {
      setUser({
        id: '2',
        username: username,
        role: UserRole.ADMIN,
        name: 'Administrator'
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook custom pentru a folosi contextul
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};