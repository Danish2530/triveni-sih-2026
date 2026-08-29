import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('triveni_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('triveni_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      setUser(res.data);
      localStorage.setItem('triveni_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Fetch current user error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('triveni_token', jwtToken);
      localStorage.setItem('triveni_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('triveni_token', jwtToken);
      localStorage.setItem('triveni_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role) => {
    const demoAccounts = {
      citizen: { email: 'citizen@demo.com', password: 'password123' },
      university: { email: 'university@demo.com', password: 'password123' },
      industry: { email: 'industry@demo.com', password: 'password123' },
      government: { email: 'government@demo.com', password: 'password123' },
      admin: { email: 'admin@demo.com', password: 'password123' }
    };

    const credentials = demoAccounts[role] || demoAccounts.citizen;
    return await login(credentials.email, credentials.password);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('triveni_token');
    localStorage.removeItem('triveni_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
