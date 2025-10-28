import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AUTH_KEYS } from '../services/authStorage';
import { spacing } from '../theme';
import { db } from '../config/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const DoctorMoreInfoScreen = () => {
  const { user, updateSettings } = useAuth();
  const { colors, inputStyles, buttonStyles, textStyles } = useTheme();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return Alert.alert('Error', 'No authenticated user');
    try {
      setSaving(true);
      const profile = { type: 'doctor', fullName, phone, specialization, licenseNumber, clinicName, address };

      await setDoc(doc(db, 'users', user.id), { profile }, { merge: true });

      const userStr = await AsyncStorage.getItem(AUTH_KEYS.USER);
      const mergedUser = { ...(userStr ? JSON.parse(userStr) : {}), profile };
      await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(mergedUser));

      await updateSettings({ profile });

      Alert.alert('Saved', 'Doctor details saved');
    } catch (e) {
      Alert.alert('Save error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, value, onChangeText, placeholder }) => (
    <View style={{ marginBottom: spacing.base }}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={inputStyles.container}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Doctor details</Text>

      <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Dr Jane Doe" />
      <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 555 000 1111" />
      <Field label="Specialization" value={specialization} onChangeText={setSpecialization} placeholder="Cardiology" />
      <Field label="License number" value={licenseNumber} onChangeText={setLicenseNumber} placeholder="LIC-123456" />
      <Field label="Clinic name" value={clinicName} onChangeText={setClinicName} placeholder="City Clinic" />
      <Field label="Address" value={address} onChangeText={setAddress} placeholder="123 Main St" />

      <TouchableOpacity disabled={saving} onPress={handleSave} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>{saving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DoctorMoreInfoScreen;
