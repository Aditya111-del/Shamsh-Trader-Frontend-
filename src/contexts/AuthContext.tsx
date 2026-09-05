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
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      if (savedUser && (token || localStorage.getItem('hasSession'))) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!localStorage.getItem('hasSession') && !localStorage.getItem('user');
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const hasSession = localStorage.getItem('hasSession');
    if (!hasSession && !token) {
      setIsLoading(false);
      return;
    }

    api.get('/auth/profile')
      .then((res) => {
        const fullUser: User = {
          ...res.data,
          token: token || res.data.token,
        };
        setUser(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
        localStorage.setItem('hasSession', '1');
      })
      .catch((err) => {
        // ONLY clear auth if the server explicitly returned 401 Unauthorized
        // (meaning token is invalid/expired), not on network hiccups or timeouts!
        if (err?.response?.status === 401) {
          localStorage.removeItem('hasSession');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('hasSession', '1');
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('hasSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    api.post('/auth/logout').finally(() => {
      setUser(null);
      setIsLoading(false);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
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
