import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../constants';

export const AuthContext = createContext(null);

const readAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

const toAuthUser = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  gender: data.gender || '',
  image: data.image || '',
  token: data.accessToken || data.token,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readAuth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      clearAuthStorage();
    }
  }, [user]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEYS.AUTH) return;
      try {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      clearAuthStorage();
      setUser(null);

      const data = await authService.login(username, password);
      const authUser = toAuthUser(data);
      setUser(authUser);
      toast.success(`Welcome back, ${authUser.firstName}!`);
      return authUser;
    } catch (error) {
      toast.error(
        error.message === 'Invalid credentials'
          ? 'Invalid credentials. Create an account if you have not signed up yet.'
          : error.message || 'Login failed'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      clearAuthStorage();
      setUser(null);

      const data = authService.register(payload);
      const authUser = toAuthUser(data);
      setUser(authUser);
      toast.success(`Account created. Welcome, ${authUser.firstName}!`);
      return authUser;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    toast.info('You have been logged out');
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        firstName: updates.firstName ?? prev.firstName,
        lastName: updates.lastName ?? prev.lastName,
        email: updates.email ?? prev.email,
        username: updates.username ?? prev.username,
        image: updates.image ?? prev.image,
      };
      toast.success('Profile updated successfully');
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
