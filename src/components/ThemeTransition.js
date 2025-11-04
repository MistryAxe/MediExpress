import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeTransition Component
 * Provides smooth animated transitions when switching themes
 * Similar to Care Express but more advanced with medical-themed animations
 */
const ThemeTransition = ({ children, duration = 300 }) => {
  const { isDark, colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    // Create a smooth transition when theme changes
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.95,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: isDark ? 1 : 0,
        duration: duration,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Animate back to normal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [isDark, duration]);

  const interpolatedBackgroundColor = backgroundColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background.primary, colors.background.primary],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: interpolatedBackgroundColor,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemeTransition;

/**
 * Hook for using theme transitions in functional components
 */
export const useThemeTransition = (duration = 300) => {
  const { isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.9,
      duration: duration / 2,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }).start();
    });
  }, [isDark, duration]);

  return { fadeAnim };
};

/**
 * Medical-themed loading transition for theme changes
 */
export const MedicalThemeTransition = ({ children }) => (
  <ThemeTransition duration={400}>
    {children}
  </ThemeTransition>
);