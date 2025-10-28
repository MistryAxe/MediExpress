import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_KEYS } from '../services/authStorage';
import { spacing, borderRadius } from '../theme';

const ROLES = [
  { key: 'patient', label: 'Patient' },
  { key: 'doctor', label: 'Doctor' },
  { key: 'pharmacy', label: 'Pharmacy' },
];

const RoleSelectionScreen = () => {
  const { user, updateSettings } = useAuth();
  const { colors, textStyles, cardStyles, buttonStyles } = useTheme();
  const [selected, setSelected] = useState(user?.role || null);

  const saveRoleToUser = async (role) => {
    const updated = { ...(user || {}), role };
    await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(updated));
    return updated;
  };

  const onContinue = async () => {
    if (!selected) return Alert.alert('Select a role', 'Please choose one to continue');

    await saveRoleToUser(selected);
    await updateSettings({ role: selected });

    Alert.alert('Role saved', `You are registered as ${selected}`);
  };

  return (
    <View style={{ padding: spacing.xl }}>
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Choose your role</Text>

      {ROLES.map((r) => {
        const active = selected === r.key;
        return (
          <TouchableOpacity
            key={r.key}
            onPress={() => setSelected(r.key)}
            activeOpacity={0.8}
            style={[
              cardStyles.container,
              {
                backgroundColor: active ? colors.primary.bg : colors.background.card,
                borderWidth: 2,
                borderColor: active ? colors.primary.main : colors.border.light,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text style={[textStyles.h3, { color: active ? colors.primary.main : colors.text.primary }]}>
              {r.label}
            </Text>
            <Text style={textStyles.bodySmall}>Tap to select</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={onContinue} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelectionScreen;
