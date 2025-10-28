import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@MediExpress:user',
  TOKEN: '@MediExpress:token',
  SETTINGS: '@MediExpress:user_settings',
};

export const saveAuthSession = async ({ user, token }) => {
  await Promise.all([
    AsyncStorage.setItem(KEYS.USER, JSON.stringify(user || {})),
    AsyncStorage.setItem(KEYS.TOKEN, token || ''),
  ]);
};

export const getAuthSession = async () => {
  const [userStr, token] = await Promise.all([
    AsyncStorage.getItem(KEYS.USER),
    AsyncStorage.getItem(KEYS.TOKEN),
  ]);
  return {
    user: userStr ? JSON.parse(userStr) : null,
    token: token || null,
    isLoggedIn: !!token,
  };
};

export const clearAuthSession = async () => {
  await Promise.all([
    AsyncStorage.removeItem(KEYS.USER),
    AsyncStorage.removeItem(KEYS.TOKEN),
  ]);
};

export const saveUserSettings = async (settings) => {
  const prev = await AsyncStorage.getItem(KEYS.SETTINGS);
  const merged = { ...(prev ? JSON.parse(prev) : {}), ...(settings || {}) };
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(merged));
  return merged;
};

export const getUserSettings = async () => {
  const s = await AsyncStorage.getItem(KEYS.SETTINGS);
  return s ? JSON.parse(s) : {};
};

export const clearUserSettings = async () => {
  await AsyncStorage.removeItem(KEYS.SETTINGS);
};

export const AUTH_KEYS = KEYS;
