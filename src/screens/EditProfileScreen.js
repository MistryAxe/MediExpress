import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AUTH_KEYS } from '../services/authStorage';
import { spacing, borderRadius } from '../theme';
import { db } from '../config/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';
import ProfileHeader from '../components/ProfileHeader';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateSettings, settings, syncProfile } = useAuth();
  const { colors, inputStyles, buttonStyles, textStyles, layoutStyles } = useTheme();
  
  const role = user?.role || settings?.role;
  const profile = settings?.profile || user?.profile || {};
  
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [medicalAid, setMedicalAid] = useState('');
  
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [qualifications, setQualifications] = useState('');
  
  const [pharmacyLicense, setPharmacyLicense] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [emergencyService, setEmergencyService] = useState(false);
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setBusinessName(profile.businessName || '');
      setPhone(profile.phone || '');
      setEmail(profile.email || user?.email || '');
      setAddress(profile.address || '');
      
      setDateOfBirth(profile.dateOfBirth || '');
      setGender(profile.gender || '');
      setEmergencyContact(profile.emergencyContact || '');
      setMedicalAid(profile.medicalAid || '');
      
      setSpecialization(profile.specialization || '');
      setLicenseNumber(profile.licenseNumber || '');
      setClinicName(profile.clinicName || '');
      setConsultationFee(profile.consultationFee || '');
      setQualifications(profile.qualifications || '');
      
      setPharmacyLicense(profile.licenseNumber || '');
      setOperatingHours(profile.hours || '');
      setDeliveryAvailable(profile.deliveryAvailable || false);
      setEmergencyService(profile.emergencyService || false);
    }
  }, [profile, user]);

  const Field = ({ label, value, onChangeText, placeholder, keyboardType, multiline, editable = true }) => (
    <View style={{ marginBottom: spacing.base }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
        <Text style={inputStyles.label}>{label}</Text>
        {!editable && (
          <View style={{ 
            marginLeft: spacing.sm, 
            paddingHorizontal: spacing.xs, 
            paddingVertical: 2, 
            backgroundColor: (colors.status?.warning || '#f59e0b') + '20', 
            borderRadius: 4 
          }}>
            <Text style={{ 
              fontSize: 10, 
              color: colors.status?.warning || '#f59e0b', 
              fontWeight: '600' 
            }}>
              PROTECTED
            </Text>
          </View>
        )}
      </View>
      <View style={[
        inputStyles.container, 
        !editable && { 
          backgroundColor: colors.background.secondary, 
          opacity: 0.7 
        }
      ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          style={[inputStyles.input, multiline && { height: 60, textAlignVertical: 'top' }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
        />
      </View>
    </View>
  );

  const SwitchField = ({ label, subtitle, value, onValueChange }) => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingVertical: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light 
    }}>
      <View style={{ flex: 1 }}>
        <Text style={textStyles.body}>{label}</Text>
        {subtitle && <Text style={[textStyles.bodySmall, { color: colors.text.tertiary }]}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border.light, true: colors.primary.light }}
        thumbColor={value ? colors.primary.main : colors.text.tertiary}
      />
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[textStyles.h3, { marginBottom: spacing.base, color: colors.primary.main }]}>{title}</Text>
      <View style={{ 
        backgroundColor: colors.background.card, 
        borderRadius: borderRadius.lg, 
        padding: spacing.lg 
      }}>
        {children}
      </View>
    </View>
  );

  const handleSave = async () => {
    if (!user?.id) return Alert.alert('Error', 'No authenticated user');
    
    const displayName = role === 'pharmacy' ? businessName : fullName;
    if (!displayName.trim()) {
      return Alert.alert('Required field', `Please enter your ${role === 'pharmacy' ? 'business name' : 'full name'}`);
    }
    
    try {
      setSaving(true);
      
      let profileData = {
        type: role,
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        updatedAt: Date.now(),
      };

      if (role === 'patient') {
        profileData = {
          ...profileData,
          fullName: fullName.trim(),
          dateOfBirth: dateOfBirth.trim(),
          gender: gender.trim(),
          emergencyContact: emergencyContact.trim(),
          medicalAid: medicalAid.trim(),
        };
      } else if (role === 'doctor') {
        profileData = {
          ...profileData,
          fullName: fullName.trim(),
          specialization: specialization.trim(),
          licenseNumber: licenseNumber.trim(),
          clinicName: clinicName.trim(),
          consultationFee: consultationFee.trim(),
          qualifications: qualifications.trim(),
        };
      } else if (role === 'pharmacy') {
        profileData = {
          ...profileData,
          businessName: businessName.trim(),
          licenseNumber: pharmacyLicense.trim(),
          hours: operatingHours.trim(),
          deliveryAvailable,
          emergencyService,
        };
      }

      console.log('Saving profile for uid:', user.id);
      await setDoc(doc(db, 'users', user.id), { profile: profileData }, { merge: true });

      const userStr = await AsyncStorage.getItem(AUTH_KEYS.USER);
      const mergedUser = { ...(userStr ? JSON.parse(userStr) : {}), profile: profileData };
      await AsyncStorage.setItem(AUTH_KEYS.USER, JSON.stringify(mergedUser));

      await updateSettings({ profile: profileData });
      await syncProfile();

      Alert.alert('Saved', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation?.goBack?.() }
      ]);
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert('Save error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!role) {
    return (
      <View style={[layoutStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={textStyles.body}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[layoutStyles.safeArea, { backgroundColor: colors.background.secondary }]}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: spacing.lg,
        backgroundColor: colors.background.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light 
      }}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={{ marginRight: spacing.base }}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textStyles.h2, { flex: 1 }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text style={[textStyles.body, { color: colors.primary.main, fontWeight: '600' }]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: spacing.lg }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader 
          profile={profile} 
          role={role} 
          onEdit={() => {}} 
        />

        <Section title="Basic Information">
          {role === 'pharmacy' ? (
            <Field
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="MediExpress Pharmacy"
            />
          ) : (
            <Field
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
            />
          )}
          
          <Field
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            editable={false}
          />
          
          <Field
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+27 123 456 7890"
            keyboardType="phone-pad"
          />
          
          <Field
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="123 Main Street, City, Province, Postal Code"
            multiline
          />
        </Section>

        {role === 'patient' && (
          <Section title="Personal Details">
            <Field
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
            />
            <Field
              label="Gender"
              value={gender}
              onChangeText={setGender}
              placeholder="Male / Female / Other"
            />
            <Field
              label="Emergency Contact"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="+27 123 456 7890 (Name)"
            />
            <Field
              label="Medical Aid"
              value={medicalAid}
              onChangeText={setMedicalAid}
              placeholder="Discovery Health / None"
            />
          </Section>
        )}

        {role === 'doctor' && (
          <>
            <Section title="Professional Details">
              <Field
                label="Specialization"
                value={specialization}
                onChangeText={setSpecialization}
                placeholder="e.g. General Practice, Cardiology"
              />
              <Field
                label="HPCSA Registration"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="MP123456"
                editable={false}
              />
              <Field
                label="Qualifications"
                value={qualifications}
                onChangeText={setQualifications}
                placeholder="MBChB, FCPaed, etc."
                multiline
              />
            </Section>
            
            <Section title="Practice Information">
              <Field
                label="Practice/Clinic Name"
                value={clinicName}
                onChangeText={setClinicName}
                placeholder="City Medical Centre"
              />
              <Field
                label="Consultation Fee"
                value={consultationFee}
                onChangeText={setConsultationFee}
                placeholder="R500 - R800"
                keyboardType="numeric"
              />
            </Section>
          </>
        )}

        {role === 'pharmacy' && (
          <>
            <Section title="Business Details">
              <Field
                label="Pharmacy License"
                value={pharmacyLicense}
                onChangeText={setPharmacyLicense}
                placeholder="PH123456"
                editable={false}
              />
              <Field
                label="Operating Hours"
                value={operatingHours}
                onChangeText={setOperatingHours}
                placeholder="Mon-Fri: 8:00-18:00, Sat: 8:00-13:00"
                multiline
              />
            </Section>
            
            <Section title="Services">
              <SwitchField
                label="Delivery Available"
                subtitle="Offer medication delivery service"
                value={deliveryAvailable}
                onValueChange={setDeliveryAvailable}
              />
              <SwitchField
                label="Emergency Service"
                subtitle="Available for emergency prescriptions"
                value={emergencyService}
                onValueChange={setEmergencyService}
              />
            </Section>
          </>
        )}

        <TouchableOpacity 
          disabled={saving} 
          onPress={handleSave} 
          style={[buttonStyles.base, buttonStyles.primary, { marginTop: spacing.lg }]}
        >
          <Text style={buttonStyles.primaryText}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
        
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;