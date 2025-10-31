import React, { useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, borderRadius } from '../theme';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseClient';

const ResetPasswordScreen = ({ navigation }) => {
  const { colors, inputStyles, buttonStyles, textStyles, layoutStyles } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const emailInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startCooldown = useCallback(() => {
    let countdown = 60;
    setResendCooldown(countdown);
    
    const interval = setInterval(() => {
      countdown--;
      setResendCooldown(countdown);
      
      if (countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  const animateToSuccess = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Simple Firebase reset - no custom URL, works immediately
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      
      setEmailSent(true);
      animateToSuccess();
      startCooldown();
      
      Alert.alert(
        'Reset Email Sent! 📧',
        `Password reset instructions sent to:\n\n${email.trim()}\n\n✅ Check your inbox (and spam folder)\n✅ Look for email from: noreply@careexpress-d7303.firebaseapp.com\n✅ Click the reset link\n✅ Firebase will open their password reset page\n✅ Enter your new password\n✅ Return to MediExpress app to sign in\n\n⏰ Link expires in 1 hour`,
        [{ text: 'Got It!' }]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many reset attempts. Please wait a few minutes before trying again.';
      }
      
      Alert.alert('Reset Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      startCooldown();
      Alert.alert('Email Resent', 'Check your inbox for the new reset link.');
    } catch (error) {
      Alert.alert('Resend Error', 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SuccessView = useCallback(() => (
    <Animated.View
      style={{
        opacity: slideAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          })
        }]
      }}
    >
      <View style={{
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#10b981',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <Ionicons name="checkmark" size={40} color="white" />
        </View>
        
        <Text style={[textStyles.h2, { textAlign: 'center', marginBottom: spacing.base }]}>
          Reset Email Sent!
        </Text>
        
        <Text style={[textStyles.body, { 
          textAlign: 'center', 
          color: colors.text.secondary,
          marginBottom: spacing.lg 
        }]}>
          We've sent password reset instructions to:
        </Text>
        
        <View style={{
          backgroundColor: colors.background.secondary,
          padding: spacing.base,
          borderRadius: borderRadius.md,
          marginBottom: spacing.lg,
        }}>
          <Text style={[textStyles.body, { 
            fontWeight: '600', 
            color: colors.primary.main,
            textAlign: 'center'
          }]}>
            {email}
          </Text>
        </View>
        
        <Text style={[textStyles.bodySmall, { 
          textAlign: 'center', 
          color: colors.text.tertiary,
          marginBottom: spacing.lg
        }]}>
          The email is from: noreply@careexpress-d7303.firebaseapp.com
        </Text>
        
        <View style={{
          backgroundColor: colors.primary.bg,
          padding: spacing.base,
          borderRadius: borderRadius.sm,
          marginBottom: spacing.lg,
        }}>
          <Text style={[textStyles.bodySmall, { 
            textAlign: 'center', 
            color: colors.primary.main,
            fontWeight: '600'
          }]}>
            ⏰ Link expires in 1 hour
          </Text>
        </View>
      </View>
    </Animated.View>
  ), [slideAnim, email, colors, textStyles, spacing, borderRadius]);

  return (
    <SafeAreaView style={[layoutStyles.safeArea, { backgroundColor: colors.background.secondary }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.lg,
          backgroundColor: colors.background.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}>
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={{ marginRight: spacing.base }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textStyles.h3, { flex: 1 }]}>
            {emailSent ? 'Check Your Email' : 'Reset Password'}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: spacing.lg,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {emailSent ? (
            <SuccessView />
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={{
                backgroundColor: colors.background.card,
                borderRadius: borderRadius.xl,
                padding: spacing.xl,
                marginBottom: spacing.lg,
              }}>
                <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: colors.primary.bg,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: spacing.lg,
                  }}>
                    <Ionicons name="lock-closed" size={40} color={colors.primary.main} />
                  </View>
                  
                  <Text style={[textStyles.h1, { textAlign: 'center', marginBottom: spacing.base }]}>
                    Reset Password
                  </Text>
                  
                  <Text style={[textStyles.body, { 
                    textAlign: 'center', 
                    color: colors.text.secondary,
                    lineHeight: 22 
                  }]}>
                    Enter your email address and we'll send you a secure link to reset your password.
                  </Text>
                </View>

                <Text style={[inputStyles.label, { marginBottom: spacing.sm }]}>Email Address</Text>
                
                <View style={{
                  backgroundColor: colors.background.secondary,
                  borderRadius: borderRadius.md,
                  borderWidth: 1,
                  borderColor: colors.border.light,
                  marginBottom: spacing.lg,
                }}>
                  <TextInput
                    ref={emailInputRef}
                    placeholder="Enter your email address"
                    placeholderTextColor={colors.text.tertiary}
                    style={{
                      fontSize: 16,
                      color: colors.text.primary,
                      padding: spacing.base,
                      minHeight: 50,
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="done"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                    onSubmitEditing={handleReset}
                  />
                </View>

                <TouchableOpacity
                  disabled={loading || !email.trim()}
                  onPress={handleReset}
                  style={[
                    buttonStyles.base, 
                    buttonStyles.primary,
                    (!email.trim() || loading) && { opacity: 0.6 }
                  ]}
                >
                  <Text style={buttonStyles.primaryText}>
                    {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Resend Section */}
          {emailSent && (
            <View style={{
              backgroundColor: colors.background.card,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              alignItems: 'center',
            }}>
              <Text style={[textStyles.bodySmall, { 
                color: colors.text.secondary,
                marginBottom: spacing.base,
                textAlign: 'center'
              }]}>
                Didn't receive the email? Check spam folder.
              </Text>
              
              <TouchableOpacity
                onPress={handleResend}
                disabled={loading || resendCooldown > 0}
                style={[
                  buttonStyles.base,
                  buttonStyles.secondary,
                  (loading || resendCooldown > 0) && { opacity: 0.6 }
                ]}
              >
                <Text style={buttonStyles.secondaryText}>
                  {resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : loading 
                    ? 'Resending...' 
                    : 'Resend Email'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Help Section */}
          <View style={{
            marginTop: spacing.xl,
            padding: spacing.lg,
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.lg,
          }}>
            <Text style={[textStyles.bodySmall, { 
              color: colors.text.secondary,
              textAlign: 'center',
              marginBottom: spacing.base
            }]}>
              Troubleshooting:
            </Text>
            
            <Text style={[textStyles.bodySmall, { 
              color: colors.text.tertiary,
              textAlign: 'center',
              lineHeight: 18
            }]}>
              • Check spam/junk folder{'\n'}
              • Look for email from: noreply@careexpress-d7303.firebaseapp.com{'\n'}
              • Link expires in 1 hour{'\n'}
              • Make sure email exists in our system
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Need Help?',
                  'If you continue having issues:\n\n• Verify the email address is correct\n• Check if you signed up with this email\n• Contact support if the problem persists',
                  [
                    { text: 'OK' },
                    {
                      text: 'Contact Support',
                      onPress: () => {
                        Alert.alert('Support', 'Email: support@mediexpress.app\nWe\'ll help you reset your password manually.');
                      }
                    }
                  ]
                );
              }}
              style={[buttonStyles.text, { marginTop: spacing.sm }]}
            >
              <Text style={[buttonStyles.textText, { textAlign: 'center' }]}>
                Still Need Help?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation?.navigate?.('Login')}
            style={[buttonStyles.text, { marginTop: spacing.lg }]}
          >
            <Text style={[buttonStyles.textText, { textAlign: 'center' }]}>
              ← Back to Sign In
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;