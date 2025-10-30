import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { spacing } from '../theme';
import ProfileHeader from '../components/ProfileHeader';
import { SettingsItem, SettingsSection } from '../components/SettingsList';
import { getEffectiveProfileAndRole } from '../utils/profileSelectors';

const SettingsScreen = ({ navigation }) => {
  const { colors, isDark, themePreference, setTheme, layoutStyles, textStyles } = useTheme();
  const { settings, logout } = useAuth();
  const [effective, setEffective] = useState({ role: null, profile: null });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await getEffectiveProfileAndRole(settings);
      if (mounted) setEffective(result);
    })();
    return () => {
      mounted = false;
    };
  }, [settings]);

  const handleEditProfile = () => {
    const { role } = effective;
    if (role === 'patient') navigation?.navigate?.('PatientMoreInfo');
    else if (role === 'doctor') navigation?.navigate?.('DoctorMoreInfo');
    else if (role === 'pharmacy') navigation?.navigate?.('PharmacyMoreInfo');
  };

  const handleThemeChange = (theme) => {
    Alert.alert('Change Theme', `Switch to ${
      theme === 'system' ? 'System Default' : theme === 'light' ? 'Light Mode' : 'Dark Mode'
    }?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Change', onPress: () => setTheme(theme) },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const themeLabel = () => {
    if (themePreference === 'system') return 'System Default';
    if (themePreference === 'light') return 'Light Mode';
    return 'Dark Mode';
  };

  return (
    <SafeAreaView style={[layoutStyles.safeArea, { backgroundColor: colors.background.secondary }]}>
      <ScrollView contentContainerStyle={{ paddingVertical: spacing.lg }} showsVerticalScrollIndicator={false}>
        {effective.role && (
          <ProfileHeader profile={effective.profile} role={effective.role} onEdit={handleEditProfile} />
        )}

        <SettingsSection title="Preferences">
          <SettingsItem
            icon="color-palette-outline"
            title="Appearance"
            subtitle={`Currently using ${themeLabel().toLowerCase()}`}
            rightText={themeLabel()}
            onPress={() =>
              Alert.alert('Choose Theme', 'Select your preferred theme', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'System Default', onPress: () => handleThemeChange('system') },
                { text: 'Light Mode', onPress: () => handleThemeChange('light') },
                { text: 'Dark Mode', onPress: () => handleThemeChange('dark') },
              ])
            }
          />
          <SettingsItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive updates and reminders"
            type="switch"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingsItem
            icon="language-outline"
            title="Language"
            rightText="English"
            onPress={() => Alert.alert('Language', 'Coming soon')}
          />
        </SettingsSection>

        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon="lock-closed-outline"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Coming soon')}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'Coming soon')}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => Alert.alert('Help Center', 'Coming soon')}
          />
          <SettingsItem
            icon="mail-outline"
            title="Contact Support"
            onPress={() => Alert.alert('Contact Support', 'Coming soon')}
          />
          <SettingsItem
            icon="star-outline"
            title="Rate App"
            onPress={() => Alert.alert('Rate App', 'Coming soon')}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem icon="information-circle-outline" title="App Version" rightText="1.0.0" type="info" />
          <SettingsItem
            icon="medical-outline"
            title="About MediExpress"
            subtitle="Healthcare Management App"
            onPress={() => Alert.alert('MediExpress', 'Healthcare Management App\nVersion 1.0.0')}
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem icon="log-out-outline" title="Sign Out" onPress={handleLogout} />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;