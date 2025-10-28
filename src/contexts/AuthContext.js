import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { saveAuthSession, getAuthSession, clearAuthSession, saveUserSettings, getUserSettings } from '../services/authStorage';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setTheme } = useTheme();
  const [state, setState] = useState({
    isLoading: true,
    isLoggedIn: false,
    user: null,
    token: null,
    settings: {},
  });

  const hydrate = async () => {
    const session = await getAuthSession();
    const settings = await getUserSettings();
    if (settings?.theme && ['light','dark','system'].includes(settings.theme)) {
      setTheme(settings.theme);
    }
    setState({
      isLoading: false,
      isLoggedIn: session.isLoggedIn,
      user: session.user,
      token: session.token,
      settings,
    });
  };

  useEffect(() => { hydrate(); }, []);

  const login = async ({ user, token }) => {
    await saveAuthSession({ user, token });
    setState((s) => ({ ...s, isLoggedIn: true, user, token }));
  };

  const logout = async () => {
    await clearAuthSession();
    setState({ isLoading: false, isLoggedIn: false, user: null, token: null, settings: {} });
  };

  const updateSettings = async (partial) => {
    const merged = await saveUserSettings(partial);
    if (partial?.theme && ['light','dark','system'].includes(partial.theme)) {
      setTheme(partial.theme);
    }
    setState((s) => ({ ...s, settings: merged }));
    return merged;
  };

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    updateSettings,
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
