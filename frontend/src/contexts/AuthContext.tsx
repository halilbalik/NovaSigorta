'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AuthState, AdminProfile, LoginRequest } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; admin: AdminProfile } }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_PROFILE'; payload: AdminProfile }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        admin: action.payload.admin,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        token: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        token: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'SET_PROFILE':
      return {
        ...state,
        admin: action.payload,
        isAuthenticated: true,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

const initialState: AuthState = {
  token: null,
  admin: null,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshProfile();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await api.login(credentials);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);


        const profileResponse = await api.getProfile();

        if (profileResponse.success && profileResponse.data) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token: response.token,
              admin: profileResponse.data,
            },
          });
          return true;
        }
      }

      dispatch({ type: 'LOGIN_ERROR' });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_ERROR' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshProfile = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.getProfile();

      if (response.success && response.data) {
        dispatch({ type: 'SET_PROFILE', payload: response.data });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
      logout();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
