import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseClient';

const LoginScreen = () => {
  const { login } = useAuth();
  const { colors, buttonStyles, inputStyles, textStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await cred.user.getIdToken();
      await login({ user: { id: cred.user.uid, name: cred.user.displayName || '', email: cred.user.email || email.trim() }, token });
      Alert.alert('Welcome', 'Signed in successfully');
    } catch (e) {
      Alert.alert('Login error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: spacing.xl }}>
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Sign in</Text>

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

      <Text style={inputStyles.label}>Password</Text>
      <View style={inputStyles.container}>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.text.tertiary}
          style={inputStyles.input}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity disabled={loading} onPress={handleLogin} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
