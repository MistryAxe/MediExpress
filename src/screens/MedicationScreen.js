import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const MedicationScreen = () => {
  const { textStyles, layoutStyles } = useTheme();
  return (
    <View style={layoutStyles.container}>
      <Text style={textStyles.h2}>Medication</Text>
      <Text style={textStyles.subtitle}>Track and manage prescriptions</Text>
    </View>
  );
};

export default MedicationScreen;
