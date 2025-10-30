import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AUTH_KEYS } from '../services/authStorage';
import { spacing } from '../theme';
import { db } from '../config/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const Field = ({ label, value, onChangeText, placeholder, colors, inputStyles, keyboardType }) => (
  <View style={{ marginBottom: spacing.base }}>
    <Text style={inputStyles.label}>{label}</Text>
    <View style={inputStyles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        style={inputStyles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const PatientMoreInfoScreen = ({ navigation }) => {
  const { user, updateSettings } = useAuth();
  const { colors, inputStyles, buttonStyles, textStyles } = useTheme();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      console.warn('No user.id in PatientMoreInfoScreen');
      return Alert.alert('Error', 'No authenticated user');
    }
    
    if (!fullName.trim()) {
      return Alert.alert('Required field', 'Please enter your full name');
    }
    
    try {
      setSaving(true);
      const profile = { 
        type: 'patient', 
        fullName: fullName.trim(), 
        phone: phone.trim(), 
        dateOfBirth: dateOfBirth.trim(), 
        gender: gender.trim(), 
        address: address.trim() 
      };

      console.log('Saving profile for uid:', user.id);
      await setDoc(doc(db, 'users', user.id), { profile }, { merge: true });

      const userStr = await AsyncStorage.getItem(AUTH_KEYS.USER);
      const mergedUser = { ...(userStr ? JSON.parse(userStr) : {}), profile };
      await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(mergedUser));

      await updateSettings({ profile });

      Alert.alert('Saved', 'Patient details saved', [
        { text: 'OK', onPress: () => navigation?.navigate?.('Main') }
      ]);
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert('Save error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={{ padding: spacing.xl }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Patient details</Text>

      <Field 
        label="Full name" 
        value={fullName} 
        onChangeText={setFullName} 
        placeholder="John Doe"
        colors={colors}
        inputStyles={inputStyles}
      />
      <Field 
        label="Phone" 
        value={phone} 
        onChangeText={setPhone} 
        placeholder="+27 123 456 7890"
        keyboardType="phone-pad"
        colors={colors}
        inputStyles={inputStyles}
      />
      <Field 
        label="Date of birth" 
        value={dateOfBirth} 
        onChangeText={setDateOfBirth} 
        placeholder="YYYY-MM-DD"
        colors={colors}
        inputStyles={inputStyles}
      />
      <Field 
        label="Gender" 
        value={gender} 
        onChangeText={setGender} 
        placeholder="Male / Female / Other"
        colors={colors}
        inputStyles={inputStyles}
      />
      <Field 
        label="Address" 
        value={address} 
        onChangeText={setAddress} 
        placeholder="123 Main Street, City, Province, Postal Code"
        colors={colors}
        inputStyles={inputStyles}
      />

      <TouchableOpacity 
        disabled={saving} 
        onPress={handleSave} 
        style={[buttonStyles.base, buttonStyles.primary]}
      >
        <Text style={buttonStyles.primaryText}>
          {saving ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PatientMoreInfoScreen;