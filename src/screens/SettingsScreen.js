import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { typography, spacing, borderRadius } from '../theme';
import ProfileSummary from '../components/ProfileSummary';
import { getEffectiveProfileAndRole } from '../utils/profileSelectors';

const SettingsScreen = () => {
  const { 
    colors, 
    isDark, 
    themePreference, 
    setTheme, 
    layoutStyles, 
    textStyles, 
    cardStyles 
  } = useTheme();
  const { settings } = useAuth();

  const [effective, setEffective] = useState({ role: null, profile: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await getEffectiveProfileAndRole(settings);
      if (mounted) setEffective(result);
    })();
    return () => { mounted = false; };
  }, [settings]);

  const themeOptions = [
    { key: 'system', label: 'System Default', description: 'Follow device settings', icon: 'phone-portrait-outline' },
    { key: 'light', label: 'Light Mode', description: 'Always use light theme', icon: 'sunny-outline' },
    { key: 'dark', label: 'Dark Mode', description: 'Always use dark theme', icon: 'moon-outline' },
  ];

  const handleThemeChange = (theme) => {
    Alert.alert(
      'Change Theme',
      `Switch to ${theme === 'system' ? 'System Default' : theme === 'light' ? 'Light Mode' : 'Dark Mode'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change', onPress: () => setTheme(theme) },
      ]
    );
  };

  const Section = ({ title, children }) => (
    <View style={{ marginBottom: spacing['2xl'] }}>
      <Text style={[textStyles.h3, { marginLeft: spacing.base, marginBottom: spacing.sm }]}>{title}</Text>
      {children}
    </View>
  );

  const SettingCard = ({ children }) => (
    <View style={[cardStyles.container, { marginHorizontal: spacing.base }]}>{children}</View>
  );

  const ThemeOption = ({ option }) => {
    const isSelected = themePreference === option.key;
    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: spacing.base,
            borderRadius: borderRadius.md,
            backgroundColor: isSelected ? colors.primary.bg : colors.background.secondary,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? colors.primary.main : colors.border.light,
            marginBottom: spacing.sm,
          }
        ]}
        onPress={() => handleThemeChange(option.key)}
        activeOpacity={0.7}
      >
        <View
          style={[
            {
              width: 48,
              height: 48,
              borderRadius: borderRadius.md,
              backgroundColor: colors.background.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.base,
              borderWidth: 1,
              borderColor: colors.border.light,
            }
          ]}
        >
          <Ionicons 
            name={option.icon} 
            size={24} 
            color={isSelected ? colors.primary.main : colors.text.secondary} 
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={[
            textStyles.body,
            {
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: isSelected ? colors.primary.main : colors.text.primary,
            }
          ]}>
            {option.label}
          </Text>
          <Text style={[
            textStyles.bodySmall,
            { color: isSelected ? colors.primary.light : colors.text.tertiary }
          ]}>
            {option.description}
          </Text>
        </View>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={colors.primary.main} />
        )}
      </TouchableOpacity>
    );
  };

  const AboutCard = () => (
    <View style={[cardStyles.container, { marginHorizontal: spacing.base }]}>
      <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <View
          style={[
            {
              width: 80,
              height: 80,
              borderRadius: borderRadius.xl,
              backgroundColor: colors.primary.main,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.base,
            }
          ]}
        >
          <Ionicons name="medical" size={40} color={colors.text.inverse} />
        </View>
        <Text style={[textStyles.h2, { color: colors.primary.main }]}>MediExpress</Text>
        <Text style={textStyles.subtitle}>Healthcare Management App</Text>
      </View>
      
      <View
        style={[
          {
            padding: spacing.base,
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius.sm,
            borderLeftWidth: 4,
            borderLeftColor: colors.medical.doctor,
          }
        ]}
      >
        <Text style={[textStyles.bodySmall, { textAlign: 'center' }]}> 
          Current Theme: {themePreference === 'system' ? 'System Default' : themePreference === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Text>
        <Text style={[textStyles.bodySmall, { textAlign: 'center', marginTop: spacing.xs }]}> 
          Active: {isDark ? 'Dark' : 'Light'} Mode
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={layoutStyles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingVertical: spacing.xl }} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[textStyles.h1, { textAlign: 'center', marginBottom: spacing.sm }]}>Settings</Text>
          <Text style={[textStyles.subtitle, { marginHorizontal: spacing.xl }]}>Customize your MediExpress experience</Text>
        </View>

        {/* Profile section */}
        {effective.role && (
          <Section title="Profile">
            <ProfileSummary role={effective.role} profile={effective.profile} />
          </Section>
        )}

        {/* Preferences section */}
        <Section title="Preferences">
          <SettingCard>
            <Text style={[textStyles.bodySmall, { marginBottom: spacing.lg }]}>Choose how MediExpress looks on your device</Text>
            {themeOptions.map((option) => (
              <ThemeOption key={option.key} option={option} />
            ))}
          </SettingCard>
        </Section>

        {/* About section */}
        <Section title="About">
          <AboutCard />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
