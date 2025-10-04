import { useReducer, useEffect } from 'react';
import { AppState, AppAction, Client, WorkEntry, UserProfile } from '../types';

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'DELETE_CLIENT':
      // Also delete associated work entries
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload),
        workEntries: state.workEntries.filter(w => w.clientId !== action.payload),
      };
    case 'ADD_WORK_ENTRY':
      return { ...state, workEntries: [...state.workEntries, action.payload] };
    case 'UPDATE_WORK_ENTRY':
      return {
        ...state,
        workEntries: state.workEntries.map(w => w.id === action.payload.id ? action.payload : w),
      };
    case 'DELETE_WORK_ENTRY':
      return {
        ...state,
        workEntries: state.workEntries.filter(w => w.id !== action.payload),
      };
    case 'SET_USER_PROFILE':
        return { ...state, userProfile: action.payload };
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

const getInitialState = (userId: string): AppState => {
    const defaultState: AppState = { clients: [], workEntries: [], userProfile: {} };
    if (!userId) return defaultState;
    try {
        const savedState = localStorage.getItem(`appData_${userId}`);
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Ensure userProfile exists for backward compatibility
            return { ...defaultState, ...parsedState };
        }
    } catch (error) {
        console.error("Failed to parse state from localStorage", error);
    }
    return defaultState;
};


export const useAppData = (userId: string | undefined) => {
  const [state, dispatch] = useReducer(appReducer, { clients: [], workEntries: [], userProfile: {} });

  useEffect(() => {
    if (userId) {
        const initialState = getInitialState(userId);
        dispatch({ type: 'SET_STATE', payload: initialState });
    } else {
        // Clear state on logout
        dispatch({ type: 'SET_STATE', payload: { clients: [], workEntries: [], userProfile: {} } });
    }
  }, [userId]);

  useEffect(() => {
    if (userId && (state.clients.length > 0 || state.workEntries.length > 0 || (state.userProfile && Object.keys(state.userProfile).length > 0))) {
        try {
            localStorage.setItem(`appData_${userId}`, JSON.stringify(state));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }
  }, [state, userId]);

  return { state, dispatch };
};
