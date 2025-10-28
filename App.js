import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import PatientMoreInfoScreen from './src/screens/PatientMoreInfoScreen';
import DoctorMoreInfoScreen from './src/screens/DoctorMoreInfoScreen';
import PharmacyMoreInfoScreen from './src/screens/PharmacyMoreInfoScreen';
import MainTabsWithHeaders from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isDark } = useTheme();
  const { isLoading, isLoggedIn, user, settings } = useAuth();

  const hasRole = !!user?.role || !!settings?.role;
  const hasProfile = !!settings?.profile || !!user?.profile;

  const navTheme = isDark ? DarkTheme : DefaultTheme;

  if (isLoading) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : !hasRole ? (
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="PatientMoreInfo" component={PatientMoreInfoScreen} />
            <Stack.Screen name="DoctorMoreInfo" component={DoctorMoreInfoScreen} />
            <Stack.Screen name="PharmacyMoreInfo" component={PharmacyMoreInfoScreen} />
          </>
        ) : !hasProfile ? (
          <>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="PatientMoreInfo" component={PatientMoreInfoScreen} />
            <Stack.Screen name="DoctorMoreInfo" component={DoctorMoreInfoScreen} />
            <Stack.Screen name="PharmacyMoreInfo" component={PharmacyMoreInfoScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabsWithHeaders} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ThemedApp = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
