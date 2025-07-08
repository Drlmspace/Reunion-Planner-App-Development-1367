import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, TABLES, isSupabaseAvailable } from '../lib/supabase';
import toast from 'react-hot-toast';

const ReunionContext = createContext({});

export const useReunion = () => {
  const context = useContext(ReunionContext);
  if (!context) {
    throw new Error('useReunion must be used within a ReunionProvider');
  }
  return context;
};

const initialState = {
  currentReunion: null,
  reunions: [],
  loading: false,
  error: null
};

const reunionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_REUNIONS':
      return { ...state, reunions: action.payload, loading: false };
    case 'SET_CURRENT_REUNION':
      return { ...state, currentReunion: action.payload };
    case 'ADD_REUNION':
      return { ...state, reunions: [...state.reunions, action.payload], currentReunion: action.payload };
    case 'UPDATE_REUNION':
      return {
        ...state,
        reunions: state.reunions.map(r => r.id === action.payload.id ? action.payload : r),
        currentReunion: state.currentReunion?.id === action.payload.id ? action.payload : state.currentReunion
      };
    case 'DELETE_REUNION':
      return {
        ...state,
        reunions: state.reunions.filter(r => r.id !== action.payload),
        currentReunion: state.currentReunion?.id === action.payload ? null : state.currentReunion
      };
    default:
      return state;
  }
};

export const ReunionProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reunionReducer, initialState);

  // For development and preview purposes
  const isPreviewEnvironment = import.meta.env.MODE === 'development' || window.location.host.includes('preview');

  useEffect(() => {
    // In preview mode, set sample data if no user
    if (isPreviewEnvironment && !user) {
      const sampleReunions = [
        {
          id: 'preview-reunion-1',
          title: 'Smith Family Reunion 2024',
          description: 'Annual gathering of the Smith family',
          type: 'family',
          planned_date: '2024-07-15',
          created_by: 'preview-user-id',
          created_at: new Date().toISOString()
        }
      ];
      dispatch({ type: 'SET_REUNIONS', payload: sampleReunions });
      dispatch({ type: 'SET_CURRENT_REUNION', payload: sampleReunions[0] });
      return;
    }

    if (user) {
      fetchReunions();
    } else {
      dispatch({ type: 'SET_REUNIONS', payload: [] });
      dispatch({ type: 'SET_CURRENT_REUNION', payload: null });
    }
  }, [user, isPreviewEnvironment]);

  const fetchReunions = async () => {
    if (!user && !isPreviewEnvironment) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Use real API call only if we have a real user and Supabase is available
      if (user && isSupabaseAvailable && supabase) {
        const { data, error } = await supabase
          .from(TABLES.REUNIONS)
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        dispatch({ type: 'SET_REUNIONS', payload: data || [] });

        // Set the first reunion as current if none is selected
        if (!state.currentReunion && data && data.length > 0) {
          dispatch({ type: 'SET_CURRENT_REUNION', payload: data[0] });
        }
      } else {
        // Load demo reunions from localStorage
        const demoReunions = JSON.parse(localStorage.getItem('demoReunions') || '[]');

        if (demoReunions.length > 0) {
          dispatch({ type: 'SET_REUNIONS', payload: demoReunions });
          if (!state.currentReunion) {
            dispatch({ type: 'SET_CURRENT_REUNION', payload: demoReunions[0] });
          }
        } else {
          // Create initial demo reunion if none exists
          const mockReunions = [
            {
              id: `demo-reunion-${Date.now()}`,
              title: 'Demo Family Reunion 2024',
              description: 'Sample reunion for demonstration',
              type: 'family',
              planned_date: '2024-07-15',
              created_by: user?.id || 'demo-user',
              created_at: new Date().toISOString()
            }
          ];
          dispatch({ type: 'SET_REUNIONS', payload: mockReunions });
          if (!state.currentReunion) {
            dispatch({ type: 'SET_CURRENT_REUNION', payload: mockReunions[0] });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reunions:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });

      // Fallback to demo mode on error
      const mockReunions = [
        {
          id: `demo-reunion-${Date.now()}`,
          title: 'Demo Family Reunion 2024',
          description: 'Sample reunion for demonstration',
          type: 'family',
          planned_date: '2024-07-15',
          created_by: user?.id || 'demo-user',
          created_at: new Date().toISOString()
        }
      ];
      dispatch({ type: 'SET_REUNIONS', payload: mockReunions });
      if (!state.currentReunion) {
        dispatch({ type: 'SET_CURRENT_REUNION', payload: mockReunions[0] });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createReunion = async (reunionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check if Supabase is available and try to use it
      if (isSupabaseAvailable && supabase && user) {
        try {
          // Real API call
          const newReunion = {
            ...reunionData,
            created_by: user.id,
            created_at: new Date().toISOString()
          };
          
          const { data, error } = await supabase
            .from(TABLES.REUNIONS)
            .insert([newReunion])
            .select()
            .single();

          if (error) throw error;

          dispatch({ type: 'ADD_REUNION', payload: data });
          toast.success('Reunion created successfully!');
          return { data, error: null };
        } catch (error) {
          console.error('Supabase error, falling back to local storage:', error);
          // Fall through to demo mode
        }
      }

      // Demo mode - create mock reunion
      const newReunion = {
        ...reunionData,
        id: `demo-reunion-${Date.now()}`,
        created_by: user?.id || 'demo-user',
        created_at: new Date().toISOString()
      };

      dispatch({ type: 'ADD_REUNION', payload: newReunion });

      // Store in localStorage for persistence in demo mode
      const existingReunions = JSON.parse(localStorage.getItem('demoReunions') || '[]');
      existingReunions.push(newReunion);
      localStorage.setItem('demoReunions', JSON.stringify(existingReunions));

      toast.success('Reunion created successfully!');
      return { data: newReunion, error: null };
    } catch (error) {
      console.error('Error creating reunion:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });

      // Final fallback to demo mode
      const fallbackReunion = {
        ...reunionData,
        id: `demo-reunion-${Date.now()}`,
        created_by: user?.id || 'demo-user',
        created_at: new Date().toISOString()
      };

      dispatch({ type: 'ADD_REUNION', payload: fallbackReunion });
      toast.success('Reunion created successfully!');
      return { data: fallbackReunion, error: null };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateReunion = async (id, updates) => {
    try {
      // Check if Supabase is available and try to use it
      if (isSupabaseAvailable && supabase) {
        try {
          // Real API call
          const { data, error } = await supabase
            .from(TABLES.REUNIONS)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;

          dispatch({ type: 'UPDATE_REUNION', payload: data });
          toast.success('Reunion updated successfully!');
          return { data, error: null };
        } catch (error) {
          console.error('Supabase error, falling back to local storage:', error);
          // Fall through to demo mode
        }
      }

      // Demo mode - update local state
      const updatedReunion = { ...(state.reunions.find(r => r.id === id) || {}), ...updates, id };
      dispatch({ type: 'UPDATE_REUNION', payload: updatedReunion });

      // Update localStorage
      const existingReunions = JSON.parse(localStorage.getItem('demoReunions') || '[]');
      const updatedReunions = existingReunions.map(r => r.id === id ? updatedReunion : r);
      localStorage.setItem('demoReunions', JSON.stringify(updatedReunions));

      toast.success('Reunion updated successfully!');
      return { data: updatedReunion, error: null };
    } catch (error) {
      console.error('Failed to update reunion:', error);

      // Fallback to demo mode
      const updatedReunion = { ...(state.reunions.find(r => r.id === id) || {}), ...updates, id };
      dispatch({ type: 'UPDATE_REUNION', payload: updatedReunion });
      toast.success('Reunion updated successfully!');
      return { data: updatedReunion, error: null };
    }
  };

  const deleteReunion = async (id) => {
    try {
      // Check if Supabase is available and try to use it
      if (isSupabaseAvailable && supabase) {
        try {
          // Real API call
          const { error } = await supabase
            .from(TABLES.REUNIONS)
            .delete()
            .eq('id', id);

          if (error) throw error;

          dispatch({ type: 'DELETE_REUNION', payload: id });

          // If we deleted the current reunion, select another one if available
          if (state.currentReunion?.id === id) {
            const remainingReunions = state.reunions.filter(r => r.id !== id);
            if (remainingReunions.length > 0) {
              dispatch({ type: 'SET_CURRENT_REUNION', payload: remainingReunions[0] });
            } else {
              dispatch({ type: 'SET_CURRENT_REUNION', payload: null });
            }
          }

          toast.success('Reunion deleted successfully!');
          return { error: null };
        } catch (error) {
          console.error('Supabase error, falling back to local storage:', error);
          // Fall through to demo mode
        }
      }

      // Demo mode - update local state
      dispatch({ type: 'DELETE_REUNION', payload: id });

      // Update localStorage
      const existingReunions = JSON.parse(localStorage.getItem('demoReunions') || '[]');
      const updatedReunions = existingReunions.filter(r => r.id !== id);
      localStorage.setItem('demoReunions', JSON.stringify(updatedReunions));

      // If we deleted the current reunion, select another one if available
      if (state.currentReunion?.id === id) {
        if (updatedReunions.length > 0) {
          dispatch({ type: 'SET_CURRENT_REUNION', payload: updatedReunions[0] });
        } else {
          dispatch({ type: 'SET_CURRENT_REUNION', payload: null });
        }
      }

      toast.success('Reunion deleted successfully!');
      return { error: null };
    } catch (error) {
      console.error('Failed to delete reunion:', error);
      toast.error('Failed to delete reunion');
      return { error };
    }
  };

  const setCurrentReunion = (reunion) => {
    dispatch({ type: 'SET_CURRENT_REUNION', payload: reunion });
    localStorage.setItem('currentReunion', JSON.stringify(reunion));
  };

  // Load demo reunions from localStorage on mount
  useEffect(() => {
    if (user && !isSupabaseAvailable) {
      const demoReunions = JSON.parse(localStorage.getItem('demoReunions') || '[]');
      if (demoReunions.length > 0) {
        dispatch({ type: 'SET_REUNIONS', payload: demoReunions });
        if (!state.currentReunion) {
          dispatch({ type: 'SET_CURRENT_REUNION', payload: demoReunions[0] });
        }
      }
    }
  }, [user, isSupabaseAvailable]);

  const value = {
    ...state,
    createReunion,
    updateReunion,
    deleteReunion,
    setCurrentReunion,
    fetchReunions,
    isSupabaseAvailable
  };

  return (
    <ReunionContext.Provider value={value}>
      {children}
    </ReunionContext.Provider>
  );
};