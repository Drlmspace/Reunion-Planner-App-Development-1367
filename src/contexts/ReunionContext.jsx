import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    if (user) {
      // Mock data for development
      const mockReunions = [
        {
          id: 'reunion-1',
          title: 'Smith Family Reunion 2024',
          description: 'Annual family gathering to reconnect and celebrate',
          type: 'family',
          planned_date: '2024-07-15',
          created_by: user.id,
          created_at: '2024-01-01'
        },
        {
          id: 'reunion-2',
          title: 'Class of 2010 Reunion',
          description: 'High school reunion - 15 year celebration',
          type: 'class',
          planned_date: '2024-08-20',
          created_by: user.id,
          created_at: '2024-01-15'
        }
      ];

      dispatch({ type: 'SET_REUNIONS', payload: mockReunions });
      
      // Set the first reunion as current if none is selected
      if (!state.currentReunion && mockReunions.length > 0) {
        dispatch({ type: 'SET_CURRENT_REUNION', payload: mockReunions[0] });
      }
    }
  }, [user, state.currentReunion]);

  const createReunion = async (reunionData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mock creation for development
      const newReunion = {
        id: `reunion-${Date.now()}`,
        ...reunionData,
        created_by: user.id,
        created_at: new Date().toISOString()
      };

      dispatch({ type: 'ADD_REUNION', payload: newReunion });
      console.log('Mock reunion created:', newReunion);
      
      return { data: newReunion, error: null };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { data: null, error };
    }
  };

  const updateReunion = async (id, updates) => {
    try {
      const updatedReunion = {
        ...state.reunions.find(r => r.id === id),
        ...updates
      };

      dispatch({ type: 'UPDATE_REUNION', payload: updatedReunion });
      console.log('Mock reunion updated:', updatedReunion);
      
      return { data: updatedReunion, error: null };
    } catch (error) {
      console.error('Failed to update reunion:', error);
      return { data: null, error };
    }
  };

  const setCurrentReunion = (reunion) => {
    dispatch({ type: 'SET_CURRENT_REUNION', payload: reunion });
  };

  const fetchReunions = async () => {
    console.log('Mock fetchReunions called');
    // In development mode, reunions are already loaded
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