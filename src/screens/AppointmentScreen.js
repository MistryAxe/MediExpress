import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const AppointmentScreen = () => {
  const { textStyles, layoutStyles } = useTheme();
  return (
    <View style={layoutStyles.container}>
      <Text style={textStyles.h2}>Appointments</Text>
      <Text style={textStyles.subtitle}>Manage your bookings</Text>
    </View>
  );
};

export default AppointmentScreen;
