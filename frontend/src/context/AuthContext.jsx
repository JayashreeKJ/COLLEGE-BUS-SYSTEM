import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartbus_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('smartbus_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smartbus_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('smartbus_user', JSON.stringify(res.data.data));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('smartbus_token');
          localStorage.removeItem('smartbus_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('smartbus_token', authToken);
    localStorage.setItem('smartbus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartbus_token');
    localStorage.removeItem('smartbus_user');
  };

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    const userRole = user.role.replace('ROLE_', '');
    const targetRole = role.replace('ROLE_', '');
    return userRole === targetRole;
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('smartbus_token');
    if (!storedToken) return null;
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.data) {
        setUser(res.data.data);
        localStorage.setItem('smartbus_user', JSON.stringify(res.data.data));
        return res.data.data;
      }
      return null;
    } catch {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
