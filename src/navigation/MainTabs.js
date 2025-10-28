import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import DashboardScreen from '../screens/DashboardScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import MedicationScreen from '../screens/MedicationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

const TopFooter = () => {
  const { colors, spacing } = useTheme();
  return (
    <View style={{
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    }}>
      <Image
        source={{ uri: 'https://dummyimage.com/40x40/2563eb/ffffff&text=M' }}
        style={{ width: 40, height: 40, borderRadius: 8 }}
        resizeMode="cover"
      />
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const TabBarIcon = ({ name, color, size }) => (
  <Ionicons name={name} size={size} color={color} />
);

export default function MainTabsWithHeaders() {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <TopFooter />
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: colors.primary.main,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.background.card,
            borderTopColor: colors.border.light,
            height: 60,
          },
          tabBarIcon: ({ color, size }) => {
            const map = {
              Dashboard: 'home-outline',
              Appointments: 'calendar-outline',
              Medication: 'medkit-outline',
              Settings: 'settings-outline',
            };
            return <TabBarIcon name={map[route.name] || 'ellipse-outline'} color={color} size={size} />;
          },
        })}
      >
        <Tabs.Screen name="Dashboard" component={DashboardScreen} />
        <Tabs.Screen name="Appointments" component={AppointmentScreen} />
        <Tabs.Screen name="Medication" component={MedicationScreen} />
        <Tabs.Screen name="Settings" component={SettingsScreen} />
      </Tabs.Navigator>
    </View>
  );
}
