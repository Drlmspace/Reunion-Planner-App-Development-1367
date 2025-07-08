import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for active session on load
  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);

        // First check for admin session
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession) {
          try {
            const adminUser = JSON.parse(adminSession);
            setUser(adminUser);
            setLoading(false);
            return;
          } catch (err) {
            console.error('Error parsing admin session:', err);
            localStorage.removeItem('adminSession');
          }
        }

        // Only try Supabase if it's available
        if (isSupabaseAvailable && supabase) {
          // Get current session from Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            return;
          }

          if (session) {
            // Get user data
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error('User error:', userError);
              return;
            }

            setUser(user);
          } else {
            setUser(null);
          }
        } else {
          // Supabase not available, check for demo user
          const demoUser = localStorage.getItem('demoUser');
          if (demoUser) {
            try {
              setUser(JSON.parse(demoUser));
            } catch (err) {
              localStorage.removeItem('demoUser');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth changes only if Supabase is available
    let subscription = null;
    if (isSupabaseAvailable && supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            setUser(session.user);
          } else {
            // Check if we have an admin session when Supabase session ends
            const adminSession = localStorage.getItem('adminSession');
            if (adminSession) {
              try {
                const adminUser = JSON.parse(adminSession);
                setUser(adminUser);
              } catch (err) {
                localStorage.removeItem('adminSession');
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
          setLoading(false);
        }
      );
      subscription = data.subscription;
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Sign up function with fallback for demo mode
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      
      if (!isSupabaseAvailable || !supabase) {
        // Demo mode - create a mock user
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: userData,
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('demoUser', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast.success('Demo account created successfully! You can now explore the app.');
        return { data: { user: mockUser }, error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      
      // If it's a network error, offer demo mode
      if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
        toast.error('Unable to connect to server. Would you like to try demo mode?');
        // Auto-create demo user as fallback
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: userData,
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('demoUser', JSON.stringify(mockUser));
        setUser(mockUser);
        
        return { data: { user: mockUser }, error: null };
      }
      
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function with fallback for demo mode
  const signIn = async (email, password) => {
    try {
      setLoading(true);

      if (!isSupabaseAvailable || !supabase) {
        // Demo mode - check for existing demo user
        const demoUser = localStorage.getItem('demoUser');
        if (demoUser) {
          const user = JSON.parse(demoUser);
          if (user.email === email) {
            setUser(user);
            toast.success('Signed in to demo mode!');
            return { data: { user }, error: null };
          }
        }
        
        // Create new demo user
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: { first_name: 'Demo', last_name: 'User' },
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('demoUser', JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success('Signed in to demo mode!');
        return { data: { user: mockUser }, error: null };
      }

      // Regular Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      
      // If it's a network error, offer demo mode
      if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          user_metadata: { first_name: 'Demo', last_name: 'User' },
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('demoUser', JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success('Connected in demo mode due to network issues!');
        return { data: { user: mockUser }, error: null };
      }
      
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);

      // Clear admin session if it exists
      localStorage.removeItem('adminSession');
      
      // Clear demo user if it exists
      localStorage.removeItem('demoUser');

      // Sign out from Supabase if available
      if (isSupabaseAvailable && supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }

      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      
      if (!isSupabaseAvailable || !supabase) {
        toast.info('Password reset is not available in demo mode. Please use admin login instead.');
        return { error: new Error('Demo mode - password reset not available') };
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isSupabaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};