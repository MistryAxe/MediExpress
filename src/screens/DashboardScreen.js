import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const DashboardScreen = () => {
  const { textStyles, layoutStyles } = useTheme();
  return (
    <View style={layoutStyles.container}>
      <Text style={textStyles.h2}>Dashboard</Text>
      <Text style={textStyles.subtitle}>Your health at a glance</Text>
    </View>
  );
};

export default DashboardScreen;
