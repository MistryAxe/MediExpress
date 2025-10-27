import { StyleSheet } from 'react-native';

// Medical-themed color palette
export const lightTheme = {
  colors: {
    primary: {
      main: '#2563eb', // Medical blue
      light: '#60a5fa',
      lighter: '#93c5fd',
      lightest: '#bfdbfe',
      bg: '#eff6ff',
    },
    
    secondary: {
      main: '#059669', // Medical green
      light: '#34d399',
      lighter: '#6ee7b7',
      lightest: '#a7f3d0',
      bg: '#ecfdf5',
    },
    
    neutral: {
      black: '#000000',
      darkest: '#1f2937',
      dark: '#374151',
      medium: '#6b7280',
      light: '#9ca3af',
      lighter: '#d1d5db',
      lightest: '#e5e7eb',
      bg: '#f9fafb',
      white: '#FFFFFF',
    },

    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
    },

    text: {
      primary: '#1e293b',
      secondary: '#475569',
      tertiary: '#64748b',
      inverse: '#ffffff',
      disabled: '#94a3b8',
    },

    success: {
      main: '#10b981',
      light: '#d1fae5',
      dark: '#065f46',
    },
    error: {
      main: '#ef4444',
      light: '#fef2f2',
      dark: '#991b1b',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
      dark: '#92400e',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
      dark: '#1e40af',
    },

    medical: {
      patient: '#3b82f6',
      doctor: '#059669',
      pharmacy: '#7c3aed',
      emergency: '#dc2626',
      prescription: '#0891b2',
    },

    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    },

    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme = {
  colors: {
    primary: {
      main: '#3b82f6', // Brighter blue for dark mode
      light: '#60a5fa',
      lighter: '#93c5fd',
      lightest: '#bfdbfe',
      bg: '#1e3a8a',
    },
    
    secondary: {
      main: '#10b981', // Brighter green for dark mode
      light: '#34d399',
      lighter: '#6ee7b7',
      lightest: '#a7f3d0',
      bg: '#064e3b',
    },
    
    neutral: {
      black: '#ffffff',
      darkest: '#f8fafc',
      dark: '#e2e8f0',
      medium: '#94a3b8',
      light: '#64748b',
      lighter: '#475569',
      lightest: '#334155',
      bg: '#0f172a',
      white: '#000000',
    },

    background: {
      primary: '#0f172a', // Dark slate
      secondary: '#1e293b',
      tertiary: '#334155',
      card: '#1e293b',
    },

    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      tertiary: '#cbd5e1',
      inverse: '#1e293b',
      disabled: '#64748b',
    },

    success: {
      main: '#22c55e',
      light: '#166534',
      dark: '#dcfce7',
    },
    error: {
      main: '#f87171',
      light: '#7f1d1d',
      dark: '#fef2f2',
    },
    warning: {
      main: '#fbbf24',
      light: '#78350f',
      dark: '#fef3c7',
    },
    info: {
      main: '#60a5fa',
      light: '#1e3a8a',
      dark: '#dbeafe',
    },

    medical: {
      patient: '#60a5fa',
      doctor: '#22c55e',
      pharmacy: '#a78bfa',
      emergency: '#f87171',
      prescription: '#22d3ee',
    },

    border: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748b',
    },

    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Dynamic shadows that adapt to theme
export const createShadows = (colors) => ({
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

// Dynamic styles that adapt to theme
export const createButtonStyles = (colors, shadows) => StyleSheet.create({
  base: {
    height: 56,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  primary: {
    backgroundColor: colors.primary.main,
    ...shadows.lg,
  },
  primaryDisabled: {
    backgroundColor: colors.primary.lighter,
    opacity: 0.7,
  },
  primaryText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },

  secondary: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  secondaryText: {
    color: colors.primary.main,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  outlineText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },

  text: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: spacing.sm,
  },
  textText: {
    color: colors.primary.main,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export const createInputStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    height: 56,
  },
  containerFocused: {
    borderColor: colors.primary.main,
    backgroundColor: colors.background.card,
  },
  containerError: {
    borderColor: colors.error.main,
    backgroundColor: colors.error.light,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.sm,
  },
});

export const createCardStyles = (colors, shadows) => StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.base,
    ...shadows.md,
  },
  elevated: {
    ...shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});

export const createLayoutStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },

  container: {
    flex: 1,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSection: {
    marginBottom: spacing['3xl'],
  },

  formSection: {
    marginBottom: spacing['2xl'],
  },

  footerSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});

export const createTextStyles = (colors) => StyleSheet.create({
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  body: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.lg * typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },

  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.tertiary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    textAlign: 'center',
  },

  link: {
    fontSize: typography.fontSize.base,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semibold,
  },
  linkSmall: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },

  helper: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  error: {
    fontSize: typography.fontSize.sm,
    color: colors.error.main,
    fontWeight: typography.fontWeight.medium,
  },
});

export const utilityStyles = StyleSheet.create({
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  alignCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },

  mt0: { marginTop: 0 },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.base },
  mb0: { marginBottom: 0 },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.base },

  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },

  fullWidth: { width: '100%' },
  halfWidth: { width: '50%' },
});

export default {
  lightTheme,
  darkTheme,
  typography,
  spacing,
  borderRadius,
  createShadows,
  createButtonStyles,
  createInputStyles,
  createCardStyles,
  createLayoutStyles,
  createTextStyles,
  utilityStyles,
};