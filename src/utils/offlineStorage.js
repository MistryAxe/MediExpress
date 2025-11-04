import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';

// Storage keys for MediExpress
const STORAGE_KEYS = {
  USER_DATA: '@mediexpress_user_data',
  AUTH_TOKEN: '@mediexpress_auth_token',
  USER_PREFERENCES: '@mediexpress_user_preferences',
  OFFLINE_QUEUE: '@mediexpress_offline_queue',
  MEDICAL_RECORDS: '@mediexpress_medical_records',
  MEDICATIONS: '@mediexpress_medications',
  APPOINTMENTS: '@mediexpress_appointments',
  PRESCRIPTIONS: '@mediexpress_prescriptions',
  EMERGENCY_CONTACTS: '@mediexpress_emergency_contacts',
  SYNC_STATUS: '@mediexpress_sync_status',
  APP_STATE: '@mediexpress_app_state',
};

// Offline storage class for managing data persistence
class OfflineStorage {
  constructor() {
    this.isConnected = true;
    this.initializeNetworkListener();
  }

  // Initialize network connectivity listener
  initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      if (this.isConnected) {
        this.syncOfflineQueue();
      }
    });
  }

  // Generic storage methods
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }

  async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return defaultValue;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // User authentication data
  async saveUserData(userData) {
    return await this.setItem(STORAGE_KEYS.USER_DATA, {
      ...userData,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getUserData() {
    return await this.getItem(STORAGE_KEYS.USER_DATA);
  }

  async saveAuthToken(token) {
    return await this.setItem(STORAGE_KEYS.AUTH_TOKEN, {
      token,
      savedAt: new Date().toISOString(),
    });
  }

  async getAuthToken() {
    const data = await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return data?.token || null;
  }

  async clearAuthData() {
    await this.removeItem(STORAGE_KEYS.USER_DATA);
    await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  }

  // User preferences and settings
  async saveUserPreferences(preferences) {
    return await this.setItem(STORAGE_KEYS.USER_PREFERENCES, {
      ...preferences,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getUserPreferences() {
    return await this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'system',
      language: 'en',
      notifications: true,
      medicationReminders: true,
      appointmentReminders: true,
      emergencyAlerts: true,
    });
  }

  // Medical data management
  async saveMedicalRecords(records) {
    return await this.setItem(STORAGE_KEYS.MEDICAL_RECORDS, {
      records,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getMedicalRecords() {
    const data = await this.getItem(STORAGE_KEYS.MEDICAL_RECORDS);
    return data?.records || [];
  }

  async saveMedications(medications) {
    return await this.setItem(STORAGE_KEYS.MEDICATIONS, {
      medications,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getMedications() {
    const data = await this.getItem(STORAGE_KEYS.MEDICATIONS);
    return data?.medications || [];
  }

  async saveAppointments(appointments) {
    return await this.setItem(STORAGE_KEYS.APPOINTMENTS, {
      appointments,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getAppointments() {
    const data = await this.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data?.appointments || [];
  }

  async savePrescriptions(prescriptions) {
    return await this.setItem(STORAGE_KEYS.PRESCRIPTIONS, {
      prescriptions,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getPrescriptions() {
    const data = await this.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return data?.prescriptions || [];
  }

  async saveEmergencyContacts(contacts) {
    return await this.setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, {
      contacts,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getEmergencyContacts() {
    const data = await this.getItem(STORAGE_KEYS.EMERGENCY_CONTACTS);
    return data?.contacts || [];
  }

  // Offline queue management for when app is offline
  async addToOfflineQueue(action) {
    try {
      const queue = await this.getOfflineQueue();
      const newAction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...action,
      };
      
      queue.push(newAction);
      return await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue);
    } catch (error) {
      console.error('Error adding to offline queue:', error);
      return false;
    }
  }

  async getOfflineQueue() {
    return await this.getItem(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  async clearOfflineQueue() {
    return await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, []);
  }

  async removeFromOfflineQueue(actionId) {
    try {
      const queue = await this.getOfflineQueue();
      const updatedQueue = queue.filter(action => action.id !== actionId);
      return await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue);
    } catch (error) {
      console.error('Error removing from offline queue:', error);
      return false;
    }
  }

  // Sync offline queue when connection is restored
  async syncOfflineQueue() {
    try {
      const queue = await this.getOfflineQueue();
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} offline actions...`);
      
      // Process each queued action
      for (const action of queue) {
        try {
          // Here you would implement the actual API calls
          // This is a placeholder for the sync logic
          await this.processOfflineAction(action);
          await this.removeFromOfflineQueue(action.id);
        } catch (error) {
          console.error('Error processing offline action:', error);
          // Leave failed actions in queue for retry
        }
      }

      console.log('Offline sync completed');
    } catch (error) {
      console.error('Error syncing offline queue:', error);
    }
  }

  // Process individual offline action (to be implemented based on your API)
  async processOfflineAction(action) {
    // This is where you'd implement the actual API calls
    // based on the action type (e.g., 'UPDATE_PROFILE', 'ADD_MEDICATION', etc.)
    console.log('Processing offline action:', action.type);
    
    // Example implementation:
    switch (action.type) {
      case 'UPDATE_PROFILE':
        // await apiClient.updateProfile(action.data);
        break;
      case 'ADD_MEDICATION':
        // await apiClient.addMedication(action.data);
        break;
      case 'BOOK_APPOINTMENT':
        // await apiClient.bookAppointment(action.data);
        break;
      default:
        console.warn('Unknown offline action type:', action.type);
    }
  }

  // App state management
  async saveAppState(state) {
    return await this.setItem(STORAGE_KEYS.APP_STATE, {
      ...state,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getAppState() {
    return await this.getItem(STORAGE_KEYS.APP_STATE, {
      isFirstLaunch: true,
      hasCompletedOnboarding: false,
      lastSyncTime: null,
    });
  }

  // Sync status tracking
  async updateSyncStatus(status) {
    return await this.setItem(STORAGE_KEYS.SYNC_STATUS, {
      ...status,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getSyncStatus() {
    return await this.getItem(STORAGE_KEYS.SYNC_STATUS, {
      lastSyncTime: null,
      pendingSync: false,
      syncInProgress: false,
    });
  }

  // Utility methods
  async getStorageSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const mediExpressKeys = keys.filter(key => key.startsWith('@mediexpress'));
      
      let totalSize = 0;
      for (const key of mediExpressKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return {
        totalKeys: mediExpressKeys.length,
        totalSize,
        sizeInKB: Math.round(totalSize / 1024),
        sizeInMB: Math.round(totalSize / (1024 * 1024)),
      };
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return null;
    }
  }

  async exportData() {
    try {
      const userData = await this.getUserData();
      const preferences = await this.getUserPreferences();
      const medicalRecords = await this.getMedicalRecords();
      const medications = await this.getMedications();
      const appointments = await this.getAppointments();
      const prescriptions = await this.getPrescriptions();
      const emergencyContacts = await this.getEmergencyContacts();

      return {
        exportDate: new Date().toISOString(),
        userData,
        preferences,
        medicalRecords,
        medications,
        appointments,
        prescriptions,
        emergencyContacts,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Network status
  getNetworkStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
export default new OfflineStorage();

// Export storage keys for external use if needed
export { STORAGE_KEYS };