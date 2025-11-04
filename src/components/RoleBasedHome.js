import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Doctor Home Component
export const DoctorHome = ({ navigation }) => {
  const { user } = useAuth();
  const { theme, colors } = useTheme();

  const doctorMenuItems = [
    {
      title: 'My Appointments',
      subtitle: 'View and manage appointments',
      icon: 'calendar-clock',
      onPress: () => navigation.navigate('DoctorAppointments'),
      color: colors.primary
    },
    {
      title: 'Patient Records',
      subtitle: 'Access patient history',
      icon: 'folder-account',
      onPress: () => navigation.navigate('PatientRecords'),
      color: colors.success
    },
    {
      title: 'Prescriptions',
      subtitle: 'Manage prescriptions',
      icon: 'prescription',
      onPress: () => navigation.navigate('PrescriptionManagement'),
      color: colors.info
    },
    {
      title: 'Bulk Medication Orders',
      subtitle: 'Order medications in bulk',
      icon: 'package-variant-closed',
      onPress: () => navigation.navigate('BulkMedicationOrder'),
      color: colors.warning
    },
    {
      title: 'Schedule',
      subtitle: 'Manage your schedule',
      icon: 'timetable',
      onPress: () => navigation.navigate('DoctorSchedule'),
      color: colors.secondary
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back, {user?.name}
        </Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          {user?.specialization} • License: {user?.licenseNumber}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Today's Appointments</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>45</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Prescriptions This Month</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {doctorMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Icon name={item.icon} size={32} color={item.color} />
            </View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Patient Home Component
export const PatientHome = ({ navigation }) => {
  const { user } = useAuth();
  const { theme, colors } = useTheme();

  const patientMenuItems = [
    {
      title: 'Book Appointment',
      subtitle: 'Schedule with doctors',
      icon: 'calendar-plus',
      onPress: () => navigation.navigate('BookAppointment'),
      color: colors.primary
    },
    {
      title: 'My Appointments',
      subtitle: 'View upcoming appointments',
      icon: 'calendar-check',
      onPress: () => navigation.navigate('PatientAppointments'),
      color: colors.success
    },
    {
      title: 'Order Medication',
      subtitle: 'Order up to 2 medications',
      icon: 'pill',
      onPress: () => navigation.navigate('MedicationOrder'),
      color: colors.info,
      badge: '2 max'
    },
    {
      title: 'My Prescriptions',
      subtitle: 'View active prescriptions',
      icon: 'file-document-outline',
      onPress: () => navigation.navigate('MyPrescriptions'),
      color: colors.warning
    },
    {
      title: 'Order History',
      subtitle: 'Track your orders',
      icon: 'history',
      onPress: () => navigation.navigate('OrderHistory'),
      color: colors.secondary
    },
    {
      title: 'Health Records',
      subtitle: 'View your medical history',
      icon: 'heart-pulse',
      onPress: () => navigation.navigate('HealthRecords'),
      color: colors.error
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Hello, {user?.name}
        </Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          Patient ID: {user?.id}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>2</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming Appointments</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.info }]}>3</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Prescriptions</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {patientMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Icon name={item.icon} size={32} color={item.color} />
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                  <Text style={[styles.badgeText, { color: colors.surface }]}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Pharmacy Home Component
export const PharmacyHome = ({ navigation }) => {
  const { user } = useAuth();
  const { theme, colors } = useTheme();

  const pharmacyMenuItems = [
    {
      title: 'Manage Inventory',
      subtitle: 'Add and update stock',
      icon: 'package-variant',
      onPress: () => navigation.navigate('InventoryManagement'),
      color: colors.primary
    },
    {
      title: 'Order Requests',
      subtitle: 'Review medication orders',
      icon: 'clipboard-list',
      onPress: () => navigation.navigate('OrderRequests'),
      color: colors.warning,
      badge: '5 new'
    },
    {
      title: 'Process Orders',
      subtitle: 'Approve or reject orders',
      icon: 'check-circle-outline',
      onPress: () => navigation.navigate('ProcessOrders'),
      color: colors.success
    },
    {
      title: 'Add New Stock',
      subtitle: 'Add medications to inventory',
      icon: 'plus-circle',
      onPress: () => navigation.navigate('AddStock'),
      color: colors.info
    },
    {
      title: 'Sales Reports',
      subtitle: 'View sales analytics',
      icon: 'chart-line',
      onPress: () => navigation.navigate('SalesReports'),
      color: colors.secondary
    },
    {
      title: 'Pharmacy Profile',
      subtitle: 'Manage pharmacy details',
      icon: 'store',
      onPress: () => navigation.navigate('PharmacyProfile'),
      color: colors.error
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
          License: {user?.licenseNumber} • {user?.address}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>15</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Orders</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>342</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Items in Stock</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        {pharmacyMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
              <Icon name={item.icon} size={32} color={item.color} />
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                  <Text style={[styles.badgeText, { color: colors.surface }]}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

// Main Role-Based Home Component
const RoleBasedHome = ({ navigation }) => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'doctor':
      return <DoctorHome navigation={navigation} />;
    case 'patient':
      return <PatientHome navigation={navigation} />;
    case 'pharmacy':
      return <PharmacyHome navigation={navigation} />;
    default:
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid user role</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    marginBottom: 30
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5
  },
  roleText: {
    fontSize: 16,
    opacity: 0.8
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 15
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center'
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15
  },
  menuItem: {
    width: '47%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  menuSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444'
  }
});

export default RoleBasedHome;