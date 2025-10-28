import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { typography, spacing } from '../theme';

const RegistrationScreen = () => {
  const { login, updateSettings } = useAuth();
  const { colors, buttonStyles, inputStyles, textStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    const token = 'mock_token_123';
    const user = { id: 'u_1', name, email, role: null };

    await login({ user, token });
    await updateSettings({ theme: 'system', notifications: true, language: 'en' });

    Alert.alert('Registered', 'Account created. Proceed to select role.');
  };

  return (
    <View style={{ padding: spacing.xl }}>
      <Text style={textStyles.h2}>Create account</Text>

      <Text style={inputStyles.label}>Name</Text>
      <View style={inputStyles.container}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor={colors.text.tertiary}
          style={inputStyles.input}
          onChangeText={setName}
          value={name}
        />
      </View>

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

      <TouchableOpacity onPress={handleRegister} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
