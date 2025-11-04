import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = '@mediexpress_notifications';
const NOTIFICATION_SETTINGS_KEY = '@mediexpress_notification_settings';

// Notification context
const NotificationContext = createContext();

// Notification actions
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_LOADING: 'SET_LOADING',
};

// Notification types for medical app
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  MEDICATION: 'medication',
  PRESCRIPTION: 'prescription',
  EMERGENCY: 'emergency',
  REMINDER: 'reminder',
  SYSTEM: 'system',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      const filtered = state.notifications.filter(n => n.id !== action.payload);
      const removedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: filtered,
        unreadCount: removedNotification && !removedNotification.read 
          ? state.unreadCount - 1 
          : state.unreadCount,
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const updatedNotifications = state.notifications.map(n => 
        n.id === action.payload ? { ...n, read: true } : n
      );
      const wasUnread = state.notifications.find(n => n.id === action.payload && !n.read);
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const unreadCount = action.payload.filter(n => !n.read).length;
      return {
        ...state,
        notifications: action.payload,
        unreadCount,
        loading: false,
      };

    case NOTIFICATION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: true,
  settings: {
    enabled: true,
    sound: true,
    vibration: true,
    badge: true,
    types: {
      [NOTIFICATION_TYPES.APPOINTMENT]: true,
      [NOTIFICATION_TYPES.MEDICATION]: true,
      [NOTIFICATION_TYPES.PRESCRIPTION]: true,
      [NOTIFICATION_TYPES.EMERGENCY]: true,
      [NOTIFICATION_TYPES.REMINDER]: true,
      [NOTIFICATION_TYPES.SYSTEM]: true,
      [NOTIFICATION_TYPES.DOCTOR]: true,
      [NOTIFICATION_TYPES.PHARMACY]: true,
    },
  },
};

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load saved data on app start
  useEffect(() => {
    loadNotifications();
    loadSettings();
    requestPermissions();
  }, []);

  // Save notifications whenever they change
  useEffect(() => {
    if (!state.loading) {
      saveNotifications(state.notifications);
    }
  }, [state.notifications, state.loading]);

  // Request notification permissions
  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  // Load saved notifications
  const loadNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      const saved = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        const notifications = JSON.parse(saved);
        dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      } else {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Save notifications to storage
  const saveNotifications = async (notifications) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Load notification settings
  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        dispatch({ type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS, payload: settings });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Save notification settings
  const saveSettings = async (settings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
      priority: NOTIFICATION_PRIORITIES.NORMAL,
      type: NOTIFICATION_TYPES.SYSTEM,
      ...notification,
    };

    dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: newNotification });

    // Show local notification if enabled
    if (state.settings.enabled && state.settings.types[newNotification.type]) {
      showLocalNotification(newNotification);
    }

    return newNotification.id;
  };

  // Show local notification
  const showLocalNotification = async (notification) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          data: { notificationId: notification.id, type: notification.type },
          sound: state.settings.sound,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  };

  // Remove notification
  const removeNotification = (id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  // Mark notification as read
  const markAsRead = (id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: id });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
  };

  // Clear all notifications
  const clearAll = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL });
  };

  // Update notification settings
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    dispatch({ type: NOTIFICATION_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
    saveSettings(updatedSettings);
  };

  // Schedule a notification for later
  const scheduleNotification = async (notification, trigger) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          data: { type: notification.type },
          sound: state.settings.sound,
        },
        trigger,
      });

      // Also add to our internal state
      addNotification({
        ...notification,
        scheduled: true,
        scheduledId: notificationId,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  // Cancel a scheduled notification
  const cancelScheduledNotification = async (scheduledId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(scheduledId);
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
    }
  };

  // Helper functions for medical-specific notifications
  const addMedicationReminder = (medication, time) => {
    return addNotification({
      type: NOTIFICATION_TYPES.MEDICATION,
      title: 'Medication Reminder',
      message: `Time to take your ${medication}`,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      data: { medication, time },
    });
  };

  const addAppointmentReminder = (appointment) => {
    return addNotification({
      type: NOTIFICATION_TYPES.APPOINTMENT,
      title: 'Appointment Reminder',
      message: `You have an appointment with ${appointment.doctor} at ${appointment.time}`,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      data: appointment,
    });
  };

  const addEmergencyAlert = (message) => {
    return addNotification({
      type: NOTIFICATION_TYPES.EMERGENCY,
      title: 'Emergency Alert',
      message,
      priority: NOTIFICATION_PRIORITIES.URGENT,
    });
  };

  const value = {
    ...state,
    // Core functions
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    updateSettings,
    scheduleNotification,
    cancelScheduledNotification,
    // Medical-specific helpers
    addMedicationReminder,
    addAppointmentReminder,
    addEmergencyAlert,
    // Utility functions
    getNotificationsByType: (type) => state.notifications.filter(n => n.type === type),
    getUnreadNotifications: () => state.notifications.filter(n => !n.read),
    hasUnreadNotifications: state.unreadCount > 0,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;