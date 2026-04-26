/**
 * useAuth — authentication hook for login/logout.
 * Manages auth state via localStorage and provides login/logout methods.
 */
import { useState, useCallback } from 'react';
import {
  getAuthToken,
  setAuthToken,
  setAuthUser,
  getAuthUser,
  clearAuthStorage,
} from '@/utils/storage';

export type AuthUser = {
  email: string;
  name: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser<AuthUser>());
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!user && !!getAuthToken();

  const login = useCallback(async (email: string, _password: string) => {
    setLoading(true);
    try {
      // Demo login — in production this would call the API
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email === 'demo@medisave.in') {
        const authUser: AuthUser = { email, name: 'Demo User' };
        const token = `demo_token_${Date.now()}`;
        setAuthToken(token);
        setAuthUser(authUser);
        setUser(authUser);
        return true;
      }

      // Accept any email for hackathon demo
      const authUser: AuthUser = {
        email,
        name: email.split('@')[0] || 'User',
      };
      const token = `token_${Date.now()}`;
      setAuthToken(token);
      setAuthUser(authUser);
      setUser(authUser);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  return { user, isAuthenticated, login, logout, loading };
}
