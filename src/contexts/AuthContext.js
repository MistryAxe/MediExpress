import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User roles
  const USER_ROLES = {
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    PHARMACY: 'pharmacy'
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (storedUser && authToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual authentication
      const response = await authenticateUser(credentials);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          email: credentials.email,
          role: response.user.role,
          name: response.user.name,
          profilePicture: response.user.profilePicture,
          specialization: response.user.specialization, // For doctors
          licenseNumber: response.user.licenseNumber, // For doctors/pharmacies
          address: response.user.address, // For pharmacies
          phone: response.user.phone,
          createdAt: response.user.createdAt
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('authToken', response.token);
        
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Simulated API call - replace with actual registration
      const response = await registerUser(userData);
      
      if (response.success) {
        return await login({ 
          email: userData.email, 
          password: userData.password 
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'authToken']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  // Role-based permissions
  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      [USER_ROLES.DOCTOR]: [
        'view_appointments',
        'create_appointments',
        'prescribe_medication',
        'order_bulk_medication',
        'view_patient_history',
        'manage_prescriptions'
      ],
      [USER_ROLES.PATIENT]: [
        'view_appointments',
        'book_appointments',
        'order_medication',
        'view_prescriptions',
        'view_order_history'
      ],
      [USER_ROLES.PHARMACY]: [
        'manage_inventory',
        'view_orders',
        'process_orders',
        'reject_orders',
        'add_medication_stock',
        'manage_pharmacy_profile'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const canOrderMedication = () => {
    return user?.role === USER_ROLES.DOCTOR || user?.role === USER_ROLES.PATIENT;
  };

  const getMaxMedicationQuantity = () => {
    if (user?.role === USER_ROLES.DOCTOR) return null; // No limit for bulk orders
    if (user?.role === USER_ROLES.PATIENT) return 2; // Maximum 2 for patients
    return 0;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    USER_ROLES,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    canOrderMedication,
    getMaxMedicationQuantity,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simulated API functions - replace with actual API calls
const authenticateUser = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock authentication logic
  const mockUsers = {
    'doctor@mediexpress.com': {
      id: '1',
      role: 'doctor',
      name: 'Dr. John Smith',
      specialization: 'General Medicine',
      licenseNumber: 'MD123456',
      phone: '+1234567890'
    },
    'patient@mediexpress.com': {
      id: '2',
      role: 'patient',
      name: 'Jane Doe',
      phone: '+1234567891'
    },
    'pharmacy@mediexpress.com': {
      id: '3',
      role: 'pharmacy',
      name: 'MediCare Pharmacy',
      licenseNumber: 'PH789012',
      address: '123 Health Street, Medical District',
      phone: '+1234567892'
    }
  };

  const user = mockUsers[credentials.email];
  if (user && credentials.password === 'password123') {
    return {
      success: true,
      user: {
        ...user,
        profilePicture: null,
        createdAt: new Date().toISOString()
      },
      token: 'mock_jwt_token_' + Date.now()
    };
  }

  return {
    success: false,
    message: 'Invalid credentials'
  };
};

const registerUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock registration logic
  return {
    success: true,
    message: 'User registered successfully'
  };
};

export default AuthContext;