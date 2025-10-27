import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import {
  lightTheme,
  darkTheme,
  createShadows,
  createButtonStyles,
  createInputStyles,
  createCardStyles,
  createLayoutStyles,
  createTextStyles,
} from '../theme';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@MediExpress:theme_preference';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState('system'); // 'light', 'dark', 'system'
  const [isLoading, setIsLoading] = useState(true);

  // Determine the actual theme to use
  const getActiveTheme = () => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  };

  const activeTheme = getActiveTheme();
  const isDark = activeTheme === 'dark';
  const themeColors = isDark ? darkTheme.colors : lightTheme.colors;

  // Create dynamic styles based on current theme
  const shadows = createShadows(themeColors);
  const buttonStyles = createButtonStyles(themeColors, shadows);
  const inputStyles = createInputStyles(themeColors);
  const cardStyles = createCardStyles(themeColors, shadows);
  const layoutStyles = createLayoutStyles(themeColors);
  const textStyles = createTextStyles(themeColors);

  // Load theme preference from storage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemePreference(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save theme preference to storage
  const saveThemePreference = async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Change theme preference
  const setTheme = (theme) => {
    if (['light', 'dark', 'system'].includes(theme)) {
      setThemePreference(theme);
      saveThemePreference(theme);
    }
  };

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const themeValue = {
    // Theme state
    themePreference,
    activeTheme,
    isDark,
    isLoading,
    
    // Theme colors and styles
    colors: themeColors,
    shadows,
    buttonStyles,
    inputStyles,
    cardStyles,
    layoutStyles,
    textStyles,
    
    // Theme actions
    setTheme,
    
    // Helper functions
    isSystemTheme: themePreference === 'system',
    toggleTheme: () => {
      const newTheme = isDark ? 'light' : 'dark';
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;