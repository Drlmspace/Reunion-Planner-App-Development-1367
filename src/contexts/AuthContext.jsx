import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Mock user for development - always logged in
  const [user] = useState({
    id: 'dev-user-123',
    email: 'developer@reunion.app',
    user_metadata: {
      first_name: 'Developer',
      last_name: 'User'
    }
  });

  // Always show as not loading and logged in
  const [loading] = useState(false);

  // Mock authentication functions for development
  const signUp = async (email, password, userData) => {
    console.log('Mock signUp called:', { email, userData });
    return { data: user, error: null };
  };

  const signIn = async (email, password) => {
    console.log('Mock signIn called:', { email });
    return { data: user, error: null };
  };

  const signOut = async () => {
    console.log('Mock signOut called');
    // In development, we don't actually sign out
  };

  const resetPassword = async (email) => {
    console.log('Mock resetPassword called:', { email });
    return { error: null };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};