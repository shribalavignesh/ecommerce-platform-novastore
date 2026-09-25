import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ecommerce_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ecommerce_token') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token]);

  async function fetchCurrentUser() {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Fetch current user error:', err);
    }
  }

  async function login(email, password) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ecommerce_token', data.token);
      localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } finally {
      setIsLoading(false);
    }
  }

  async function register(name, email, password, role = 'user') {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ecommerce_token', data.token);
      localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } finally {
      setIsLoading(false);
    }
  }

  async function loginAsDemo(role = 'admin') {
    const creds = role === 'admin'
      ? { email: 'admin@shop.com', password: 'admin123' }
      : { email: 'alex@demo.com', password: 'user123' };

    return await login(creds.email, creds.password);
  }

  function logout() {
    setUser(null);
    setToken('');
    localStorage.removeItem('ecommerce_token');
    localStorage.removeItem('ecommerce_user');
  }

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isAuthenticated,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
