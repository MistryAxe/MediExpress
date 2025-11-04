# MediExpress 🏥

A comprehensive medical app built with React Native and Expo for managing healthcare needs across different user roles.

## 📱 Features

### 🎨 **Enhanced Theme System**
- **Dynamic Theme Switching**: Toggle between light, dark, and system themes
- **Theme Persistence**: Your theme preference is saved and restored
- **Medical-Focused Design**: Professional color palette designed for healthcare
- **Comprehensive Styling**: Pre-built styles for buttons, inputs, cards, and layouts

### 🔔 **Advanced Notification System**
- **Medical-Specific Notifications**: Medication reminders, appointment alerts, emergency notifications
- **Local & Push Notifications**: Built-in support for both notification types
- **Notification Persistence**: Offline storage with sync capabilities
- **Customizable Settings**: Control notification types, sounds, and timing
- **Priority Levels**: Urgent, high, normal, and low priority notifications

### 🌍 **Multi-Language Support**
- **3 Languages**: English, Spanish (Español), and French (Français)
- **Medical Terminology**: Comprehensive medical translations
- **RTL Support**: Ready for Right-to-Left languages
- **Smart Formatting**: Localized dates, times, numbers, and currency
- **Auto-Detection**: Automatically uses system language when available

### 💾 **Comprehensive Offline Storage**
- **Medical Data**: Store medications, appointments, prescriptions offline
- **Sync Queue**: Automatic data synchronization when online
- **Data Export**: Complete data backup and export functionality
- **Emergency Info**: Offline access to critical medical information
- **Network Awareness**: Intelligent handling of online/offline states

### 👥 **Role-Based Access**
- **Patient**: Manage medical records, appointments, medications
- **Doctor**: Handle patient records, appointments, prescriptions
- **Pharmacist**: Manage prescriptions, inventory, consultations
- **Nurse**: Assist with patient care and procedures
- **Administrator**: System management and user accounts

### 🔐 **Authentication & Security**
- **Secure Login**: Email/password authentication with validation
- **Role Selection**: Choose your healthcare role during onboarding
- **Profile Management**: Complete user profile setup
- **Session Management**: Secure token handling with persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MistryAxe/MediExpress.git
   cd MediExpress
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## 🛠️ Usage

### Using the Theme System

```javascript
import { useTheme } from './src/contexts/ThemeContext';

const MyComponent = () => {
  const { colors, isDark, toggleTheme, setTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>Hello MediExpress!</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};
```

### Using Notifications

```javascript
import { useNotifications } from './src/contexts/NotificationContext';

const MyComponent = () => {
  const { 
    addNotification, 
    addMedicationReminder, 
    addAppointmentReminder,
    notifications,
    unreadCount 
  } = useNotifications();
  
  const remindMedication = () => {
    addMedicationReminder('Aspirin', '9:00 AM');
  };
  
  const scheduleAppointment = () => {
    addAppointmentReminder({
      doctor: 'Dr. Smith',
      time: '2:00 PM',
      date: 'Tomorrow'
    });
  };
  
  return (
    <View>
      <Text>Unread Notifications: {unreadCount}</Text>
      <Button title="Medication Reminder" onPress={remindMedication} />
      <Button title="Appointment Reminder" onPress={scheduleAppointment} />
    </View>
  );
};
```

### Using Translations

```javascript
import { useLanguage, useTranslation } from './src/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage, formatDate } = useLanguage();
  
  return (
    <View>
      <Text>{t('auth.signIn')}</Text>
      <Text>{t('medical.appointment')}</Text>
      <Text>{t('roles.continueAsRole', { role: 'Patient' })}</Text>
      <Text>{formatDate(new Date())}</Text>
      
      <Button 
        title="Español" 
        onPress={() => changeLanguage('es')} 
      />
      <Button 
        title="English" 
        onPress={() => changeLanguage('en')} 
      />
    </View>
  );
};
```

### Using Offline Storage

```javascript
import offlineStorage from './src/utils/offlineStorage';

const MyComponent = () => {
  const saveMedicalData = async () => {
    // Save user's medications
    await offlineStorage.saveMedications([
      { name: 'Aspirin', dosage: '100mg', frequency: 'Daily' }
    ]);
    
    // Save appointments
    await offlineStorage.saveAppointments([
      { doctor: 'Dr. Smith', date: '2025-11-05', time: '14:00' }
    ]);
    
    // Add to offline queue (syncs when online)
    await offlineStorage.addToOfflineQueue({
      type: 'UPDATE_PROFILE',
      data: { firstName: 'John', lastName: 'Doe' }
    });
  };
  
  const loadData = async () => {
    const medications = await offlineStorage.getMedications();
    const appointments = await offlineStorage.getAppointments();
    console.log('Medications:', medications);
    console.log('Appointments:', appointments);
  };
  
  return (
    <View>
      <Button title="Save Data" onPress={saveMedicalData} />
      <Button title="Load Data" onPress={loadData} />
    </View>
  );
};
```

## 📁 Project Structure

```
MediExpress/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts for state management
│   │   ├── AuthContext.js      # Authentication management
│   │   ├── ThemeContext.js     # Theme and styling
│   │   ├── NotificationContext.js  # Notification system
│   │   └── LanguageContext.js   # Internationalization
│   ├── navigation/         # Navigation configuration
│   ├── screens/           # App screens/pages
│   ├── services/          # API and external services
│   ├── utils/             # Utility functions and helpers
│   │   ├── offlineStorage.js   # Offline data management
│   │   └── translations.js     # Translation definitions
│   ├── config/            # App configuration
│   └── theme.js           # Theme definitions and styles
├── assets/                # Images, fonts, and static assets
├── App.js                 # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Key Components & Contexts

### ThemeContext
- Manages light/dark theme switching
- Provides colors and pre-built styles
- Persists theme preference
- Supports system theme detection

### NotificationContext
- Handles all notification types
- Manages notification persistence
- Provides medical-specific helpers
- Supports scheduled notifications

### LanguageContext
- Multi-language support
- Localized formatting functions
- RTL language support
- System language detection

### AuthContext
- User authentication
- Role-based access control
- Session management
- Profile completion tracking

### OfflineStorage
- Medical data persistence
- Network-aware sync queue
- Data export/backup
- Storage size management

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser

## 📚 Dependencies

### Core
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation library

### State Management
- **AsyncStorage** - Local data persistence
- **NetInfo** - Network connectivity detection

### Notifications
- **Expo Notifications** - Local and push notifications

### Internationalization
- **Expo Localization** - Device locale detection

### UI Components
- **Expo Vector Icons** - Icon library
- **React Native Safe Area Context** - Safe area handling

## 🌟 What's New

This version includes significant enhancements inspired by Care Express while maintaining the original MediExpress styling and structure:

✅ **Enhanced Theme System** with persistence and system detection  
✅ **Comprehensive Notification Management** with medical-specific features  
✅ **Multi-Language Support** with 3 languages and medical terminology  
✅ **Advanced Offline Storage** with sync queue and medical data management  
✅ **Improved Navigation** with localized labels and RTL support  
✅ **Updated Dependencies** for modern React Native development  

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License.

## 🔮 Future Enhancements

- [ ] Add more languages (Arabic, Portuguese, German)
- [ ] Implement push notification server
- [ ] Add biometric authentication
- [ ] Create comprehensive API integration
- [ ] Add voice commands and accessibility features
- [ ] Implement telemedicine video calls
- [ ] Add AI-powered symptom checker
- [ ] Create medication interaction warnings

---

**MediExpress** - Your comprehensive healthcare companion 🩺✨