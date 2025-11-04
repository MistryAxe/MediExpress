import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

/**
 * MedicalNotificationBanner Component
 * Enhanced notification banner combining Care Express simplicity with MediExpress medical focus
 * Shows important medical notifications with priority-based styling
 */
const MedicalNotificationBanner = ({ 
  notification, 
  onDismiss, 
  onPress,
  autoDismiss = true,
  autoDismissDelay = 5000,
  showIcon = true,
  showActions = true,
}) => {
  const { colors, isDark } = useTheme();
  const { markAsRead } = useNotifications();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss with progress bar
    if (autoDismiss && autoDismissDelay > 0) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: autoDismissDelay,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
      if (notification && !notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    }
    handleDismiss();
  };

  const getNotificationStyle = () => {
    const baseStyle = {
      backgroundColor: colors.background.card,
      borderLeftColor: colors.primary.main,
      borderLeftWidth: 4,
    };

    switch (notification?.priority) {
      case NOTIFICATION_PRIORITIES.URGENT:
        return {
          ...baseStyle,
          backgroundColor: colors.error.light,
          borderLeftColor: colors.error.main,
          borderLeftWidth: 6,
        };
      case NOTIFICATION_PRIORITIES.HIGH:
        return {
          ...baseStyle,
          backgroundColor: colors.warning.light,
          borderLeftColor: colors.warning.main,
          borderLeftWidth: 5,
        };
      case NOTIFICATION_PRIORITIES.LOW:
        return {
          ...baseStyle,
          borderLeftColor: colors.neutral.light,
          borderLeftWidth: 3,
        };
      default:
        return baseStyle;
    }
  };

  const getIconName = () => {
    switch (notification?.type) {
      case NOTIFICATION_TYPES.EMERGENCY:
        return 'alert-circle';
      case NOTIFICATION_TYPES.MEDICATION:
        return 'medical';
      case NOTIFICATION_TYPES.APPOINTMENT:
        return 'calendar';
      case NOTIFICATION_TYPES.PRESCRIPTION:
        return 'receipt';
      case NOTIFICATION_TYPES.DOCTOR:
        return 'person-circle';
      case NOTIFICATION_TYPES.PHARMACY:
        return 'storefront';
      case NOTIFICATION_TYPES.REMINDER:
        return 'alarm';
      default:
        return 'notifications';
    }
  };

  const getIconColor = () => {
    switch (notification?.priority) {
      case NOTIFICATION_PRIORITIES.URGENT:
        return colors.error.main;
      case NOTIFICATION_PRIORITIES.HIGH:
        return colors.warning.main;
      case NOTIFICATION_PRIORITIES.LOW:
        return colors.neutral.medium;
      default:
        return colors.primary.main;
    }
  };

  if (!isVisible || !notification) return null;

  const notificationStyle = getNotificationStyle();
  const iconName = getIconName();
  const iconColor = getIconColor();

  return (
    <Animated.View
      style={[
        styles.container,
        notificationStyle,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
          shadowColor: colors.shadow,
        },
      ]}
    >
      {/* Progress bar for auto-dismiss */}
      {autoDismiss && (
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: iconColor,
            },
          ]}
        />
      )}

      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {showIcon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={24}
              color={iconColor}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: colors.text.primary }
            ]}
            numberOfLines={1}
          >
            {notification.title || t('notification.default_title')}
          </Text>
          <Text
            style={[
              styles.message,
              { color: colors.text.secondary }
            ]}
            numberOfLines={2}
          >
            {notification.message || notification.body}
          </Text>
          {notification.timestamp && (
            <Text
              style={[
                styles.timestamp,
                { color: colors.text.tertiary }
              ]}
            >
              {new Date(notification.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>

        {showActions && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close"
              size={20}
              color={colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressBar: {
    height: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    minHeight: 70,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicalNotificationBanner;

/**
 * Hook for managing notification banners
 */
export const useNotificationBanner = () => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  
  const showNotification = (notification) => {
    const id = notification.id || Date.now().toString();
    setVisibleNotifications(prev => [...prev, { ...notification, id }]);
  };
  
  const hideNotification = (id) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const hideAllNotifications = () => {
    setVisibleNotifications([]);
  };
  
  return {
    visibleNotifications,
    showNotification,
    hideNotification,
    hideAllNotifications,
  };
};

/**
 * Medical notification banner container for multiple notifications
 */
export const MedicalNotificationContainer = ({ notifications = [], onNotificationPress }) => {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      {notifications.map((notification, index) => (
        <MedicalNotificationBanner
          key={notification.id || index}
          notification={notification}
          onPress={onNotificationPress}
          onDismiss={() => {}} // Handle dismissal in parent
        />
      ))}
    </View>
  );
};