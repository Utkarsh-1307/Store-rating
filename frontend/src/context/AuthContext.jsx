import { createContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../services/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const { token: t, user: u } = res.data.data;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    if (u.role === 'ADMIN') navigate('/admin/dashboard');
    else if (u.role === 'STORE_OWNER') navigate('/owner/dashboard');
    else navigate('/stores');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
