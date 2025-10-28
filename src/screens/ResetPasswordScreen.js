import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseClient';

const ResetPasswordScreen = () => {
  const { colors, inputStyles, buttonStyles, textStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      return Alert.alert('Missing email', 'Please enter your account email');
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Email sent', 'Check your inbox for a password reset link.');
    } catch (e) {
      Alert.alert('Reset error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: spacing.xl }}>
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Reset password</Text>

      <Text style={inputStyles.label}>Email</Text>
      <View style={inputStyles.container}>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor={colors.text.tertiary}
          style={inputStyles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <TouchableOpacity disabled={loading} onPress={handleReset} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>{loading ? 'Sending...' : 'Send reset link'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;
