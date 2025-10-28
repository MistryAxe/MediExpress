import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme';

const Row = ({ label, value, textStyles, colors }) => {
  if (!value) return null;
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={[textStyles.bodySmall, { color: colors.text.tertiary }]}>{label}</Text>
      <Text style={textStyles.body}>{value}</Text>
    </View>
  );
};

const PatientProfile = ({ profile, textStyles, colors, cardStyles }) => (
  <View style={[cardStyles.container]}>
    <Text style={[textStyles.h3, { marginBottom: spacing.lg }]}>Profile</Text>
    <Row label="Full name" value={profile?.fullName} textStyles={textStyles} colors={colors} />
    <Row label="Phone" value={profile?.phone} textStyles={textStyles} colors={colors} />
    <Row label="Date of birth" value={profile?.dateOfBirth} textStyles={textStyles} colors={colors} />
    <Row label="Gender" value={profile?.gender} textStyles={textStyles} colors={colors} />
    <Row label="Address" value={profile?.address} textStyles={textStyles} colors={colors} />
  </View>
);

const DoctorProfile = ({ profile, textStyles, colors, cardStyles }) => (
  <View style={[cardStyles.container]}>
    <Text style={[textStyles.h3, { marginBottom: spacing.lg }]}>Profile</Text>
    <Row label="Full name" value={profile?.fullName} textStyles={textStyles} colors={colors} />
    <Row label="Phone" value={profile?.phone} textStyles={textStyles} colors={colors} />
    <Row label="Specialization" value={profile?.specialization} textStyles={textStyles} colors={colors} />
    <Row label="License number" value={profile?.licenseNumber} textStyles={textStyles} colors={colors} />
    <Row label="Clinic name" value={profile?.clinicName} textStyles={textStyles} colors={colors} />
    <Row label="Address" value={profile?.address} textStyles={textStyles} colors={colors} />
  </View>
);

const PharmacyProfile = ({ profile, textStyles, colors, cardStyles }) => (
  <View style={[cardStyles.container]}>
    <Text style={[textStyles.h3, { marginBottom: spacing.lg }]}>Profile</Text>
    <Row label="Business name" value={profile?.businessName} textStyles={textStyles} colors={colors} />
    <Row label="Phone" value={profile?.phone} textStyles={textStyles} colors={colors} />
    <Row label="License number" value={profile?.licenseNumber} textStyles={textStyles} colors={colors} />
    <Row label="Address" value={profile?.address} textStyles={textStyles} colors={colors} />
    <Row label="Hours" value={profile?.hours} textStyles={textStyles} colors={colors} />
  </View>
);

const ProfileSummary = ({ role, profile }) => {
  const { colors, textStyles, cardStyles } = useTheme();
  if (!role) return null;
  if (role === 'patient') return <PatientProfile profile={profile} textStyles={textStyles} colors={colors} cardStyles={cardStyles} />;
  if (role === 'doctor') return <DoctorProfile profile={profile} textStyles={textStyles} colors={colors} cardStyles={cardStyles} />;
  if (role === 'pharmacy') return <PharmacyProfile profile={profile} textStyles={textStyles} colors={colors} cardStyles={cardStyles} />;
  return null;
};

export default ProfileSummary;
