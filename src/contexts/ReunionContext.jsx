import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, TABLES } from '../lib/supabase';
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
      return {
        ...state,
        reunions: [...state.reunions, action.payload],
        currentReunion: action.payload
      };
    case 'UPDATE_REUNION':
      return {
        ...state,
        reunions: state.reunions.map(r => 
          r.id === action.payload.id ? action.payload : r
        ),
        currentReunion: state.currentReunion?.id === action.payload.id 
          ? action.payload 
          : state.currentReunion
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
      
      // Use real API call only if we have a real user
      if (user && !isPreviewEnvironment) {
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
      }
    } catch (error) {
      console.error('Error fetching reunions:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to load reunions');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createReunion = async (reunionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mock create for preview environment
      if (isPreviewEnvironment) {
        const newReunion = {
          ...reunionData,
          id: `preview-reunion-${Date.now()}`,
          created_by: user?.id || 'preview-user-id',
          created_at: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_REUNION', payload: newReunion });
        toast.success('Reunion created successfully!');
        
        return { data: newReunion, error: null };
      }
      
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
      console.error('Error creating reunion:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast.error('Failed to create reunion');
      return { data: null, error };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateReunion = async (id, updates) => {
    try {
      // Mock update for preview environment
      if (isPreviewEnvironment) {
        const updatedReunion = {
          ...(state.reunions.find(r => r.id === id) || {}),
          ...updates,
          id
        };
        
        dispatch({ type: 'UPDATE_REUNION', payload: updatedReunion });
        toast.success('Reunion updated successfully!');
        
        return { data: updatedReunion, error: null };
      }
      
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
      console.error('Failed to update reunion:', error);
      toast.error('Failed to update reunion');
      return { data: null, error };
    }
  };

  const setCurrentReunion = (reunion) => {
    dispatch({ type: 'SET_CURRENT_REUNION', payload: reunion });
    localStorage.setItem('currentReunion', JSON.stringify(reunion));
  };

  const value = {
    ...state,
    createReunion,
    updateReunion,
    setCurrentReunion,
    fetchReunions
  };

  return (
    <ReunionContext.Provider value={value}>
      {children}
    </ReunionContext.Provider>
  );
};