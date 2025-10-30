import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseClient';
import { 
  saveOfflineCredentials, 
  validateOfflineCredentials 
} from '../services/authStorage';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { colors, buttonStyles, inputStyles, textStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Missing info', 'Please enter email and password');
    }

    try {
      setLoading(true);

      // 1. Try Firebase authentication first
      try {
        console.log('Attempting Firebase login...');
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const token = await cred.user.getIdToken();
        const user = {
          id: cred.user.uid,
          name: cred.user.displayName || '',
          email: cred.user.email || email.trim(),
        };

        await login({ user, token });
        
        // Save credentials for offline fallback on successful Firebase login
        await saveOfflineCredentials(email, password, user);
        
        Alert.alert('Welcome', 'Signed in successfully');
        return;
        
      } catch (firebaseError) {
        console.log('Firebase login failed:', firebaseError.code, firebaseError.message);
        
        // 2. Check if it's a network-related error
        const networkErrors = [
          'auth/network-request-failed',
          'auth/timeout',
          'unavailable',
          'network-request-failed'
        ];
        
        const isNetworkError = networkErrors.some(error => 
          firebaseError.code?.includes(error) || 
          firebaseError.message?.toLowerCase().includes('network') ||
          firebaseError.message?.toLowerCase().includes('timeout') ||
          firebaseError.message?.toLowerCase().includes('unavailable')
        );

        if (isNetworkError) {
          console.log('Network error detected, trying offline login...');
          
          // 3. Try offline credentials
          const offlineResult = await validateOfflineCredentials(email, password);
          if (offlineResult) {
            // Create offline session token
            const offlineToken = `offline_${Date.now()}_${offlineResult.user.id}`;
            
            await login({ 
              user: offlineResult.user, 
              token: offlineToken 
            });
            
            Alert.alert(
              'Offline Sign In', 
              'Connected using offline mode. Some features may be limited until you reconnect to the internet.',
              [{ text: 'Continue' }]
            );
            return;
          } else {
            // No offline credentials available
            Alert.alert(
              'Connection Error', 
              'Unable to connect to server and no offline credentials found. Please check your internet connection and try again.'
            );
            return;
          }
        }
        
        // 4. If not a network error, show the original Firebase error
        throw firebaseError;
      }
      
    } catch (e) {
      console.error('Login error:', e);
      Alert.alert('Login Error', e.message || 'An unexpected error occurred');
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

      <TouchableOpacity 
        disabled={loading} 
        onPress={handleLogin} 
        style={[buttonStyles.base, buttonStyles.primary]}
      >
        <Text style={buttonStyles.primaryText}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation?.navigate?.('ResetPassword')}
        style={[buttonStyles.text, { marginTop: spacing.sm }]}
      >
        <Text style={buttonStyles.textText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation?.navigate?.('Registration')}
        style={[buttonStyles.text, { marginTop: spacing.xs }]}
      >
        <Text style={buttonStyles.textText}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;