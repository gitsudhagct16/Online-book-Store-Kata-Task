import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check for existing session on app load
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      setLoading(true);
      const { user: existingUser, token: existingToken } = await getCurrentUser();
      setUser(existingUser);
      setToken(existingToken);
      setAuthError(null);
    } catch (error) {
      // No existing session or invalid session
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { user: loggedInUser, token: userToken } = await loginUser(credentials);

      setUser(loggedInUser);
      setToken(userToken);

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { user: newUser, token: userToken } = await registerUser(userData);

      setUser(newUser);
      setToken(userToken);

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      await logoutUser();
      setUser(null);
      setToken(null);
      setAuthError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
      setToken(null);
      setAuthError(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    authLoading,
    authError,
    login,
    register,
    logout,
    clearAuthError,
    refreshUser: checkExistingSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};