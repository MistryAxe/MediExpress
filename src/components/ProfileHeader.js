import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../theme';

const ProfileHeader = ({ profile, role, onEdit }) => {
  const { colors, textStyles } = useTheme();

  const displayName = () => {
    if (role === 'pharmacy') return profile?.businessName || 'Pharmacy';
    return profile?.fullName || 'Your Name';
  };

  const subtitle = () => {
    if (role === 'doctor') return profile?.specialization || 'Doctor';
    if (role === 'pharmacy') return 'Pharmacy';
    return 'Patient';
  };

  const initials = () => {
    const name = displayName();
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.background.card,
        marginHorizontal: spacing.base,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary.main,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.base,
        }}
      >
        <Text style={[textStyles.h2, { color: colors.text.inverse, fontSize: 28 }]}>
          {initials()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[textStyles.h3, { marginBottom: spacing.xs }]}>{displayName()}</Text>
        <Text style={[textStyles.bodySmall, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
          {subtitle()}
        </Text>
        {profile?.email ? (
          <Text style={[textStyles.bodySmall, { color: colors.text.tertiary }]}>{profile.email}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={onEdit}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="create-outline" size={20} color={colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;