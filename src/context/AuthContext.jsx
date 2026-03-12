import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // In a real app, we might validate the token with the backend here
    if (token) {
      setUser({ token }); // Simplified user object
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ Email: email, Password: password });
      const { token, user: userData } = response.data; // Adjust based on actual API response
      // The swagger doesn't show the response structure for login, assuming it returns a token.
      // If it just returns "OK", we might need to adjust.
      // Let's assume standard JWT response for now.
      // If the response is just the token string or object, I'll handle it.
      
      // Based on common practices, let's assume it returns { token: "..." }
      // If not, I'll debug it later.
      
      const authToken = response.data.token || response.data; 
      localStorage.setItem('token', authToken);
      setUser({ token: authToken, ...userData });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
