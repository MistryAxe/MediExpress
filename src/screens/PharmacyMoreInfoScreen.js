import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AUTH_KEYS } from '../services/authStorage';
import { spacing } from '../theme';
import { db } from '../config/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

const PharmacyMoreInfoScreen = () => {
  const { user, updateSettings } = useAuth();
  const { colors, inputStyles, buttonStyles, textStyles } = useTheme();

  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return Alert.alert('Error', 'No authenticated user');
    try {
      setSaving(true);
      const profile = { type: 'pharmacy', businessName, phone, licenseNumber, address, hours };

      await setDoc(doc(db, 'users', user.id), { profile }, { merge: true });

      const userStr = await AsyncStorage.getItem(AUTH_KEYS.USER);
      const mergedUser = { ...(userStr ? JSON.parse(userStr) : {}), profile };
      await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(mergedUser));

      await updateSettings({ profile });

      Alert.alert('Saved', 'Pharmacy details saved');
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
      <Text style={[textStyles.h2, { marginBottom: spacing.base }]}>Pharmacy details</Text>

      <Field label="Business name" value={businessName} onChangeText={setBusinessName} placeholder="MediExpress Pharmacy" />
      <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 555 000 1111" />
      <Field label="License number" value={licenseNumber} onChangeText={setLicenseNumber} placeholder="LIC-987654" />
      <Field label="Address" value={address} onChangeText={setAddress} placeholder="123 Main St" />
      <Field label="Hours" value={hours} onChangeText={setHours} placeholder="Mon–Fri 8:00–18:00" />

      <TouchableOpacity disabled={saving} onPress={handleSave} style={[buttonStyles.base, buttonStyles.primary]}>
        <Text style={buttonStyles.primaryText}>{saving ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PharmacyMoreInfoScreen;
