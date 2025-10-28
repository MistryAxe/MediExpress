// Fetch profile & role effectively from settings with AsyncStorage fallback
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_KEYS } from '../services/authStorage';

export const getEffectiveProfileAndRole = async (settings) => {
  const role = settings?.role;
  const profile = settings?.profile;
  if (role && profile) return { role, profile };
  try {
    const userStr = await AsyncStorage.getItem(AUTH_KEYS.USER);
    if (!userStr) return { role: role || null, profile: profile || null };
    const user = JSON.parse(userStr);
    return {
      role: role || user?.role || null,
      profile: profile || user?.profile || null,
    };
  } catch {
    return { role: role || null, profile: profile || null };
  }
};
