import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { I18nManager } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import PatientMoreInfoScreen from './src/screens/PatientMoreInfoScreen';
import DoctorMoreInfoScreen from './src/screens/DoctorMoreInfoScreen';
import PharmacyMoreInfoScreen from './src/screens/PharmacyMoreInfoScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import MedicationScreen from './src/screens/MedicationScreen';

// Placeholder Orders screen for Pharmacy (reuses Medication screen UI for now)
const OrdersScreen = MedicationScreen;

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabIcon = ({ name, color, size }) => <Ionicons name={name} size={size} color={color} />;

// Patient tabs
const PatientTabs = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
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
          return <TabIcon name={map[route.name] || 'ellipse-outline'} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarLabel: t('navigation.home') }}
      />
      <Tabs.Screen 
        name="Appointments" 
        component={AppointmentScreen} 
        options={{ tabBarLabel: t('navigation.appointments') }}
      />
      <Tabs.Screen 
        name="Medication" 
        component={MedicationScreen} 
        options={{ tabBarLabel: t('navigation.medications') }}
      />
      <Tabs.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: t('navigation.settings') }}
      />
    </Tabs.Navigator>
  );
};

// Doctor tabs (same for now; diverge later)
const DoctorTabs = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
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
          return <TabIcon name={map[route.name] || 'ellipse-outline'} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarLabel: t('navigation.home') }}
      />
      <Tabs.Screen 
        name="Appointments" 
        component={AppointmentScreen} 
        options={{ tabBarLabel: t('navigation.appointments') }}
      />
      <Tabs.Screen 
        name="Medication" 
        component={MedicationScreen} 
        options={{ tabBarLabel: t('navigation.medications') }}
      />
      <Tabs.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: t('navigation.settings') }}
      />
    </Tabs.Navigator>
  );
};

// Pharmacy tabs
const PharmacyTabs = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
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
            Medication: 'medkit-outline',
            Orders: 'receipt-outline',
            Settings: 'settings-outline',
          };
          return <TabIcon name={map[route.name] || 'ellipse-outline'} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarLabel: t('navigation.home') }}
      />
      <Tabs.Screen 
        name="Medication" 
        component={MedicationScreen} 
        options={{ tabBarLabel: t('navigation.medications') }}
      />
      <Tabs.Screen 
        name="Orders" 
        component={OrdersScreen} 
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tabs.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ tabBarLabel: t('navigation.settings') }}
      />
    </Tabs.Navigator>
  );
};

// Pick tabs by role
const MainTabsByRole = ({ role }) => {
  if (role === 'pharmacy') return <PharmacyTabs />;
  if (role === 'doctor') return <DoctorTabs />;
  return <PatientTabs />;
};

const RootNavigator = () => {
  const { isDark } = useTheme();
  const { isLoading, isLoggedIn, user, settings } = useAuth();
  const { isRTL } = useLanguage();

  const role = user?.role || settings?.role || null;
  const hasRole = !!role;
  const hasProfile = !!settings?.profile || !!user?.profile;

  // Configure RTL if needed
  React.useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  const navTheme = isDark ? DarkTheme : DefaultTheme;

  if (isLoading) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Enable native-like swipe back gesture + slide transition
          gestureEnabled: true,
          gestureResponseDistance: { horizontal: 300 },
          animation: 'slide_from_right',
        }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                gestureResponseDistance: { horizontal: 250 },
              }}
            />
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
            <Stack.Screen
              name="Main"
              // Pass role to choose the correct tabs
              children={() => <MainTabsByRole role={role} />}
              options={{
                // Typically disable swipe back from Main
                gestureEnabled: false,
              }}
            />
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
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <ThemedApp />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}