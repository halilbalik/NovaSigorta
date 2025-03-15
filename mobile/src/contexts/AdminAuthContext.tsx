import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminApi } from '../services/api';

interface Admin {
  username: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('adminToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await adminApi.getProfile(storedToken);
          setAdmin({ username: profile.username });
          setIsAuthenticated(true);
        } catch (error) {
          await AsyncStorage.removeItem('adminToken');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await adminApi.login(username, password);
      if (response.success && response.token) {
        await AsyncStorage.setItem('adminToken', response.token);
        setToken(response.token);
        setAdmin({ username });
        setIsAuthenticated(true);
        return { success: true, message: 'Giriş başarılı' };
      } else {
        return { success: false, message: response.message || 'Giriş başarısız' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Giriş sırasında hata oluştu' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        admin,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
