import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../theme';

const SettingsItem = ({
  icon,
  title,
  subtitle,
  type = 'navigation', // 'navigation' | 'switch' | 'info'
  onPress,
  value,
  onValueChange,
  rightText,
}) => {
  const { colors, textStyles } = useTheme();

  return (
    <TouchableOpacity
      onPress={type !== 'switch' ? onPress : undefined}
      activeOpacity={type !== 'switch' ? 0.7 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.background.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
      }}
    >
      {icon ? (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: colors.primary.bg,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.base,
          }}
        >
          <Ionicons name={icon} size={18} color={colors.primary.main} />
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <Text style={textStyles.body}>{title}</Text>
        {subtitle ? (
          <Text style={[textStyles.bodySmall, { color: colors.text.tertiary, marginTop: 2 }]}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {rightText ? (
          <Text style={[textStyles.bodySmall, { color: colors.text.secondary, marginRight: spacing.sm }]}>{rightText}</Text>
        ) : null}

        {type === 'switch' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.border.light, true: colors.primary.light }}
            thumbColor={value ? colors.primary.main : colors.text.tertiary}
          />
        ) : type === 'navigation' ? (
          <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const SettingsSection = ({ title, children }) => {
  const { colors, textStyles } = useTheme();
  
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={[
          textStyles.bodySmall,
          {
            color: colors.text.secondary,
            marginLeft: spacing.lg,
            marginBottom: spacing.sm,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontWeight: '600',
          },
        ]}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.background.card,
          marginHorizontal: spacing.base,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
        }}
      >
        {children}
      </View>
    </View>
  );
};

export { SettingsItem, SettingsSection };