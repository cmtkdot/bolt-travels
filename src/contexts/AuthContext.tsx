import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // TODO: Check if user is already logged in (e.g., from localStorage or a token)
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic (e.g., API call to backend)
    setUser({ email });
  };

  const logout = async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};