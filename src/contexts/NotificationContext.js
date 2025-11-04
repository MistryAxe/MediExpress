import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Notification types
export const NOTIFICATION_TYPES = {
  EMERGENCY: 'emergency',
  MEDICATION: 'medication',
  APPOINTMENT: 'appointment',
  PRESCRIPTION: 'prescription',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  REMINDER: 'reminder',
  SYSTEM: 'system',
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  URGENT: 'urgent',
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
};

// Storage keys
const NOTIFICATIONS_STORAGE_KEY = '@mediexpress_notifications';
const SETTINGS_STORAGE_KEY = '@mediexpress_notification_settings';

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Notification context
const NotificationContext = createContext();

// Actions
const ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
      };
    
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    
    case ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        ),
      };
    
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    
    case ACTIONS.SET_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case ACTIONS.SET_LOADING:
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
  settings: {
    enabled: true,
    sound: true,
    vibration: true,
    medicationReminders: true,
    appointmentReminders: true,
    prescriptionAlerts: true,
    emergencyAlerts: true,
  },
  loading: true,
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    initializeNotifications();
    setupNotificationListeners();
  }, []);

  // Initialize notifications and settings
  const initializeNotifications = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }

      // Load stored notifications
      const storedNotifications = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      } else {
        dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: [] });
      }

      // Load settings
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        dispatch({ type: ACTIONS.SET_SETTINGS, payload: settings });
      }

    } catch (error) {
      console.error('Error initializing notifications:', error);
      dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: [] });
    }
  };

  // Setup notification listeners
  const setupNotificationListeners = () => {
    // Listen for notifications received while app is open
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const notificationData = {
          id: Date.now().toString(),
          title: notification.request.content.title,
          message: notification.request.content.body,
          type: notification.request.content.data?.type || NOTIFICATION_TYPES.SYSTEM,
          priority: notification.request.content.data?.priority || NOTIFICATION_PRIORITIES.NORMAL,
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        addNotification(notificationData);
      }
    );

    // Listen for notification taps
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const notificationId = response.notification.request.content.data?.id;
        if (notificationId) {
          markAsRead(notificationId);
        }
      }
    );

    return () => {
      notificationReceivedListener && Notifications.removeNotificationSubscription(notificationReceivedListener);
      notificationResponseListener && Notifications.removeNotificationSubscription(notificationResponseListener);
    };
  };

  // Save notifications to storage
  const saveNotifications = async (notifications) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Save settings to storage
  const saveSettings = async (settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  // Add a new notification
  const addNotification = (notificationData) => {
    const notification = {
      id: notificationData.id || Date.now().toString(),
      ...notificationData,
      timestamp: notificationData.timestamp || new Date().toISOString(),
      read: false,
    };

    dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notification });
    
    // Save to storage
    const updatedNotifications = [notification, ...state.notifications];
    saveNotifications(updatedNotifications);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    dispatch({ type: ACTIONS.MARK_AS_READ, payload: notificationId });
    
    const updatedNotifications = state.notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true, readAt: new Date().toISOString() }
        : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: notificationId });
    
    const updatedNotifications = state.notifications.filter(
      notification => notification.id !== notificationId
    );
    saveNotifications(updatedNotifications);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: [] });
    saveNotifications([]);
  };

  // Update settings
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    dispatch({ type: ACTIONS.SET_SETTINGS, payload: updatedSettings });
    saveSettings(updatedSettings);
  };

  // Schedule a local notification
  const scheduleNotification = async (notificationContent, trigger = null) => {
    try {
      if (!state.settings.enabled) {
        console.log('Notifications are disabled');
        return;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationContent.title,
          body: notificationContent.message,
          data: {
            ...notificationContent,
            id: notificationContent.id || Date.now().toString(),
          },
          sound: state.settings.sound ? 'default' : false,
        },
        trigger: trigger || null, // null means immediate
      });

      // Also add to our local state
      addNotification(notificationContent);

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  // Medical-specific notification helpers
  const addMedicationReminder = (medicationData) => {
    if (!state.settings.medicationReminders) return;

    const notification = {
      type: NOTIFICATION_TYPES.MEDICATION,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      title: 'Medication Reminder',
      message: `Time to take your ${medicationData.name}`,
      ...medicationData,
    };

    scheduleNotification(notification);
  };

  const addAppointmentReminder = (appointmentData) => {
    if (!state.settings.appointmentReminders) return;

    const notification = {
      type: NOTIFICATION_TYPES.APPOINTMENT,
      priority: NOTIFICATION_PRIORITIES.NORMAL,
      title: 'Appointment Reminder',
      message: `Appointment with ${appointmentData.doctor} at ${appointmentData.time}`,
      ...appointmentData,
    };

    scheduleNotification(notification);
  };

  const addPrescriptionAlert = (prescriptionData) => {
    if (!state.settings.prescriptionAlerts) return;

    const notification = {
      type: NOTIFICATION_TYPES.PRESCRIPTION,
      priority: NOTIFICATION_PRIORITIES.HIGH,
      title: 'New Prescription',
      message: `You have a new prescription: ${prescriptionData.medication}`,
      ...prescriptionData,
    };

    scheduleNotification(notification);
  };

  const addEmergencyAlert = (emergencyData) => {
    if (!state.settings.emergencyAlerts) return;

    const notification = {
      type: NOTIFICATION_TYPES.EMERGENCY,
      priority: NOTIFICATION_PRIORITIES.URGENT,
      title: 'Emergency Alert',
      message: emergencyData.message,
      ...emergencyData,
    };

    scheduleNotification(notification);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return state.notifications.filter(notification => !notification.read);
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return state.notifications.filter(notification => notification.type === type);
  };

  // Get notifications by priority
  const getNotificationsByPriority = (priority) => {
    return state.notifications.filter(notification => notification.priority === priority);
  };

  const value = {
    ...state,
    
    // Core functions
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    scheduleNotification,
    
    // Settings
    updateSettings,
    settings: state.settings,
    
    // Medical-specific helpers
    addMedicationReminder,
    addAppointmentReminder,
    addPrescriptionAlert,
    addEmergencyAlert,
    
    // Getters
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByPriority,
    
    // Stats
    unreadCount: getUnreadNotifications().length,
    totalCount: state.notifications.length,
    
    // Types and priorities for reference
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITIES,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;