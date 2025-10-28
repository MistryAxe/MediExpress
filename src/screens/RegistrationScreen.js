import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { typography, spacing } from '../theme';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const RegistrationScreen = () => {
  const { login, updateSettings } = useAuth();
  const { colors, buttonStyles, inputStyles, textStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;

      await setDoc(doc(db, 'users', uid), {
        uid,
        name,
        email: email.trim().toLowerCase(),
        role: null,
        createdAt: Date.now(),
      });

      const token = await cred.user.getIdToken();
      await login({ user: { id: uid, name, email: email.trim(), role: null }, token });
      await updateSettings({ theme: 'system', notifications: true, language: 'en' });

      Alert.alert('Registered', 'Account created. Proceed to select role.');
    } catch (e) {
      Alert.alert('Registration error', e.message);
    }
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

      <TouchableOpacity onPress={handleRegister} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
