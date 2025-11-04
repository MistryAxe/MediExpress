import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { translate, DEFAULT_LANGUAGE, AVAILABLE_LANGUAGES } from '../utils/translations';

// Language storage key
const LANGUAGE_STORAGE_KEY = '@mediexpress_language';

// Language context
const LanguageContext = createContext();

// Language actions
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
  SET_SYSTEM_LANGUAGE: 'SET_SYSTEM_LANGUAGE',
};

// Language reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
        loading: false,
      };
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case LANGUAGE_ACTIONS.SET_SYSTEM_LANGUAGE:
      return {
        ...state,
        systemLanguage: action.payload,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  currentLanguage: DEFAULT_LANGUAGE,
  systemLanguage: DEFAULT_LANGUAGE,
  loading: true,
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Load saved language and detect system language on app start
  useEffect(() => {
    initializeLanguage();
  }, []);

  // Initialize language settings
  const initializeLanguage = async () => {
    try {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });
      
      // Get system language
      const locales = getLocales();
      const systemLang = locales[0]?.languageCode || DEFAULT_LANGUAGE;
      
      // Check if system language is supported
      const supportedSystemLang = AVAILABLE_LANGUAGES.find(
        lang => lang.code === systemLang
      )?.code || DEFAULT_LANGUAGE;
      
      dispatch({ 
        type: LANGUAGE_ACTIONS.SET_SYSTEM_LANGUAGE, 
        payload: supportedSystemLang 
      });

      // Load saved language preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage && AVAILABLE_LANGUAGES.find(lang => lang.code === savedLanguage)) {
        dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: savedLanguage });
      } else {
        // Use system language if no saved preference
        dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: supportedSystemLang });
      }
    } catch (error) {
      console.error('Error initializing language:', error);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: DEFAULT_LANGUAGE });
    }
  };

  // Save language preference
  const saveLanguage = async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  // Change language
  const changeLanguage = (language) => {
    if (AVAILABLE_LANGUAGES.find(lang => lang.code === language)) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
      saveLanguage(language);
    } else {
      console.warn(`Language ${language} is not supported`);
    }
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === state.currentLanguage) || 
           AVAILABLE_LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE);
  };

  // Translation function with current language
  const t = (key, params = {}) => {
    return translate(key, state.currentLanguage, params);
  };

  // Check if current language is RTL (Right-to-Left)
  const isRTL = () => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(state.currentLanguage);
  };

  // Get language direction
  const getLanguageDirection = () => {
    return isRTL() ? 'rtl' : 'ltr';
  };

  // Format date according to current language
  const formatDate = (date, options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString(state.currentLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return date?.toString() || '';
    }
  };

  // Format time according to current language
  const formatTime = (date, options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString(state.currentLanguage, {
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return date?.toString() || '';
    }
  };

  // Format date and time together
  const formatDateTime = (date, options = {}) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString(state.currentLanguage, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      });
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return date?.toString() || '';
    }
  };

  // Format numbers according to current language
  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(state.currentLanguage, options).format(number);
    } catch (error) {
      console.error('Error formatting number:', error);
      return number?.toString() || '';
    }
  };

  // Format currency according to current language
  const formatCurrency = (amount, currency = 'USD', options = {}) => {
    try {
      return new Intl.NumberFormat(state.currentLanguage, {
        style: 'currency',
        currency,
        ...options,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${currency} ${amount}`;
    }
  };

  // Get pluralized translation
  const tPlural = (key, count, params = {}) => {
    const pluralKey = count === 1 ? key : `${key}s`;
    return t(pluralKey, { count, ...params });
  };

  // Medical-specific formatting helpers
  const formatMedicalDate = (date) => {
    return formatDate(date, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAppointmentTime = (date) => {
    return formatTime(date, { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: state.currentLanguage === 'en'
    });
  };

  const formatMedicationDosage = (dosage, unit) => {
    const formattedDosage = formatNumber(dosage);
    return `${formattedDosage} ${unit}`;
  };

  // Context value
  const value = {
    ...state,
    // Language management
    changeLanguage,
    getCurrentLanguageInfo,
    availableLanguages: AVAILABLE_LANGUAGES,
    isRTL,
    getLanguageDirection,
    
    // Translation functions
    t,
    tPlural,
    translate: (key, params) => translate(key, state.currentLanguage, params),
    
    // Formatting functions
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    
    // Medical-specific formatters
    formatMedicalDate,
    formatAppointmentTime,
    formatMedicationDosage,
    
    // Utility functions
    isCurrentLanguage: (lang) => state.currentLanguage === lang,
    isSystemLanguage: () => state.currentLanguage === state.systemLanguage,
    getLanguageName: (code) => AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.name || code,
    getLanguageFlag: (code) => AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.flag || '🌐',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// HOC for language-aware components
export const withLanguage = (Component) => {
  return (props) => {
    const language = useLanguage();
    return <Component {...props} language={language} />;
  };
};

// Translation hook (shorthand)
export const useTranslation = () => {
  const { t, tPlural, currentLanguage } = useLanguage();
  return { t, tPlural, currentLanguage };
};

export default LanguageContext;