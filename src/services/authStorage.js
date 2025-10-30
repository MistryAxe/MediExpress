import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@MediExpress:user',
  TOKEN: '@MediExpress:token',
  SETTINGS: '@MediExpress:user_settings',
  OFFLINE_USER: '@MediExpress:offline_user', // New: for offline login fallback
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

// === OFFLINE AUTHENTICATION FUNCTIONS ===

// Save user credentials for offline fallback (after successful Firebase login)
export const saveOfflineCredentials = async (email, password, userData) => {
  try {
    const offlineUser = {
      email: email.trim().toLowerCase(),
      password, // In production, hash this with crypto
      userData,
      lastLogin: Date.now(),
      savedAt: Date.now(),
    };
    await AsyncStorage.setItem(KEYS.OFFLINE_USER, JSON.stringify(offlineUser));
  } catch (error) {
    console.error('Failed to save offline credentials:', error);
  }
};

// Check if offline credentials match the login attempt
export const validateOfflineCredentials = async (email, password) => {
  try {
    const offlineUserStr = await AsyncStorage.getItem(KEYS.OFFLINE_USER);
    if (!offlineUserStr) return null;
    
    const offlineUser = JSON.parse(offlineUserStr);
    
    // Check if credentials match
    if (
      offlineUser.email === email.trim().toLowerCase() && 
      offlineUser.password === password
    ) {
      // Update last login time
      offlineUser.lastLogin = Date.now();
      await AsyncStorage.setItem(KEYS.OFFLINE_USER, JSON.stringify(offlineUser));
      
      return {
        user: offlineUser.userData,
        isOffline: true,
        lastLogin: offlineUser.lastLogin,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to validate offline credentials:', error);
    return null;
  }
};

// Get offline user info (for debugging/status)
export const getOfflineUser = async () => {
  try {
    const offlineUserStr = await AsyncStorage.getItem(KEYS.OFFLINE_USER);
    return offlineUserStr ? JSON.parse(offlineUserStr) : null;
  } catch (error) {
    console.error('Failed to get offline user:', error);
    return null;
  }
};

// Clear offline credentials
export const clearOfflineCredentials = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.OFFLINE_USER);
  } catch (error) {
    console.error('Failed to clear offline credentials:', error);
  }
};

// Check if current session is offline
export const isOfflineSession = async () => {
  try {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    return token && token.startsWith('offline_');
  } catch (error) {
    return false;
  }
};

// === UTILITY FUNCTIONS ===

// Clear all auth data (including offline)
export const clearAllAuthData = async () => {
  await Promise.all([
    clearAuthSession(),
    clearOfflineCredentials(),
    clearUserSettings(),
  ]);
};

// Get connection status info for debugging
export const getAuthStatus = async () => {
  const session = await getAuthSession();
  const isOffline = await isOfflineSession();
  const offlineUser = await getOfflineUser();
  
  return {
    isLoggedIn: session.isLoggedIn,
    isOfflineMode: isOffline,
    hasOfflineBackup: !!offlineUser,
    user: session.user,
    lastOfflineLogin: offlineUser?.lastLogin || null,
  };
};

export const AUTH_KEYS = KEYS;