import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  token?: string; // JWT token returned on login (for Bearer fallback)
  profileImage?: string;
  isVerified?: boolean;
  authProvider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Only validate session if we have a local hint that the user was logged in.
    // This prevents a noisy 401 on every cold page load for anonymous visitors.
    if (!localStorage.getItem('hasSession')) return;

    api.get('/auth/profile')
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // Token expired or invalid — clear the hint and treat as logged out
        localStorage.removeItem('hasSession');
        localStorage.removeItem('authToken');
        setUser(null);
      });
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('hasSession', '1');
    // If the server returned a token in the response body, persist it as Bearer fallback
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hasSession');
    localStorage.removeItem('authToken');
    api.post('/auth/logout').finally(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
