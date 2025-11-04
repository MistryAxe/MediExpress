// MediExpress Translation System
// Supporting multiple languages for medical app

export const translations = {
  en: {
    // Authentication
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      invalidCredentials: 'Invalid email or password',
      signInSuccess: 'Successfully signed in!',
      signUpSuccess: 'Account created successfully!',
      passwordResetSent: 'Password reset email sent',
      loading: 'Please wait...',
    },

    // Role Selection
    roles: {
      selectRole: 'Select Your Role',
      patient: 'Patient',
      doctor: 'Doctor',
      pharmacist: 'Pharmacist',
      nurse: 'Nurse',
      administrator: 'Administrator',
      patientDescription: 'Access your medical records, appointments, and prescriptions',
      doctorDescription: 'Manage patient records, appointments, and prescriptions',
      pharmacistDescription: 'Manage prescriptions, inventory, and patient consultations',
      nurseDescription: 'Assist with patient care and medical procedures',
      administratorDescription: 'Manage system settings and user accounts',
      continueAsRole: 'Continue as {{role}}',
    },

    // Navigation
    navigation: {
      home: 'Home',
      appointments: 'Appointments',
      medications: 'Medications',
      prescriptions: 'Prescriptions',
      records: 'Medical Records',
      profile: 'Profile',
      settings: 'Settings',
      emergency: 'Emergency',
      notifications: 'Notifications',
      doctors: 'Doctors',
      pharmacies: 'Pharmacies',
      search: 'Search',
      help: 'Help',
      about: 'About',
    },

    // Medical Terms
    medical: {
      appointment: 'Appointment',
      appointments: 'Appointments',
      medication: 'Medication',
      medications: 'Medications',
      prescription: 'Prescription',
      prescriptions: 'Prescriptions',
      diagnosis: 'Diagnosis',
      symptoms: 'Symptoms',
      treatment: 'Treatment',
      dosage: 'Dosage',
      frequency: 'Frequency',
      doctor: 'Doctor',
      specialist: 'Specialist',
      pharmacy: 'Pharmacy',
      hospital: 'Hospital',
      clinic: 'Clinic',
      patient: 'Patient',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate',
      temperature: 'Temperature',
      weight: 'Weight',
      height: 'Height',
      allergies: 'Allergies',
      medicalHistory: 'Medical History',
      emergencyContact: 'Emergency Contact',
      insurance: 'Insurance',
      labResults: 'Lab Results',
    },

    // Common Actions
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      update: 'Update',
      add: 'Add',
      remove: 'Remove',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',
      share: 'Share',
      export: 'Export',
      import: 'Import',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      close: 'Close',
      ok: 'OK',
      yes: 'Yes',
      no: 'No',
      enable: 'Enable',
      disable: 'Disable',
    },

    // Time and Dates
    time: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      nextWeek: 'Next Week',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      duration: 'Duration',
    },

    // Settings
    settings: {
      general: 'General',
      account: 'Account',
      privacy: 'Privacy',
      security: 'Security',
      notifications: 'Notifications',
      language: 'Language',
      theme: 'Theme',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      systemMode: 'System Mode',
      fontSize: 'Font Size',
      accessibility: 'Accessibility',
      dataManagement: 'Data Management',
      backup: 'Backup',
      restore: 'Restore',
      exportData: 'Export Data',
      deleteAccount: 'Delete Account',
    },

    // Notifications
    notifications: {
      medicationReminder: 'Medication Reminder',
      appointmentReminder: 'Appointment Reminder',
      prescriptionReady: 'Prescription Ready',
      emergencyAlert: 'Emergency Alert',
      systemNotification: 'System Notification',
      newMessage: 'New Message',
      markAllRead: 'Mark All as Read',
      clearAll: 'Clear All',
      noNotifications: 'No notifications',
      enable: 'Enable Notifications',
      disable: 'Disable Notifications',
    },

    // Error Messages
    errors: {
      genericError: 'Something went wrong. Please try again.',
      networkError: 'Network connection error. Please check your internet connection.',
      timeoutError: 'Request timed out. Please try again.',
      invalidInput: 'Please enter valid information.',
      requiredField: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
      weakPassword: 'Password must be at least 8 characters long.',
      passwordMismatch: 'Passwords do not match.',
      phoneInvalid: 'Please enter a valid phone number.',
      noData: 'No data available.',
      loadingError: 'Error loading data.',
      saveError: 'Error saving data.',
      deleteError: 'Error deleting data.',
      permissionDenied: 'Permission denied.',
      unauthorized: 'Unauthorized access.',
      sessionExpired: 'Session expired. Please sign in again.',
    },

    // Success Messages
    success: {
      dataSaved: 'Data saved successfully!',
      dataUpdated: 'Data updated successfully!',
      dataDeleted: 'Data deleted successfully!',
      appointmentBooked: 'Appointment booked successfully!',
      appointmentCanceled: 'Appointment canceled successfully!',
      prescriptionFilled: 'Prescription filled successfully!',
      profileUpdated: 'Profile updated successfully!',
      settingsSaved: 'Settings saved successfully!',
      backupCreated: 'Backup created successfully!',
      dataExported: 'Data exported successfully!',
      notificationSent: 'Notification sent successfully!',
    },

    // Emergency
    emergency: {
      callEmergency: 'Call Emergency',
      emergencyContacts: 'Emergency Contacts',
      medicalAlert: 'Medical Alert',
      allergyAlert: 'Allergy Alert',
      currentMedications: 'Current Medications',
      medicalConditions: 'Medical Conditions',
      bloodType: 'Blood Type',
      emergencyInfo: 'Emergency Information',
      location: 'Location',
      shareLocation: 'Share Location',
    },
  },

  es: {
    // Autenticación
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      phoneNumber: 'Número de Teléfono',
      forgotPassword: '¿Olvidaste tu contraseña?',
      resetPassword: 'Restablecer Contraseña',
      createAccount: 'Crear Cuenta',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      dontHaveAccount: '¿No tienes una cuenta?',
      invalidCredentials: 'Email o contraseña inválidos',
      signInSuccess: '¡Sesión iniciada exitosamente!',
      signUpSuccess: '¡Cuenta creada exitosamente!',
      passwordResetSent: 'Email de restablecimiento enviado',
      loading: 'Por favor espera...',
    },

    // Selección de Rol
    roles: {
      selectRole: 'Selecciona tu Rol',
      patient: 'Paciente',
      doctor: 'Doctor',
      pharmacist: 'Farmacéutico',
      nurse: 'Enfermero/a',
      administrator: 'Administrador',
      patientDescription: 'Accede a tus registros médicos, citas y recetas',
      doctorDescription: 'Gestiona registros de pacientes, citas y recetas',
      pharmacistDescription: 'Gestiona recetas, inventario y consultas de pacientes',
      nurseDescription: 'Asiste con el cuidado de pacientes y procedimientos médicos',
      administratorDescription: 'Gestiona configuraciones del sistema y cuentas de usuario',
      continueAsRole: 'Continuar como {{role}}',
    },

    // Navegación
    navigation: {
      home: 'Inicio',
      appointments: 'Citas',
      medications: 'Medicamentos',
      prescriptions: 'Recetas',
      records: 'Registros Médicos',
      profile: 'Perfil',
      settings: 'Configuración',
      emergency: 'Emergencia',
      notifications: 'Notificaciones',
      doctors: 'Doctores',
      pharmacies: 'Farmacias',
      search: 'Buscar',
      help: 'Ayuda',
      about: 'Acerca de',
    },

    // Términos Médicos
    medical: {
      appointment: 'Cita',
      appointments: 'Citas',
      medication: 'Medicamento',
      medications: 'Medicamentos',
      prescription: 'Receta',
      prescriptions: 'Recetas',
      diagnosis: 'Diagnóstico',
      symptoms: 'Síntomas',
      treatment: 'Tratamiento',
      dosage: 'Dosis',
      frequency: 'Frecuencia',
      doctor: 'Doctor',
      specialist: 'Especialista',
      pharmacy: 'Farmacia',
      hospital: 'Hospital',
      clinic: 'Clínica',
      patient: 'Paciente',
      bloodPressure: 'Presión Arterial',
      heartRate: 'Ritmo Cardíaco',
      temperature: 'Temperatura',
      weight: 'Peso',
      height: 'Altura',
      allergies: 'Alergias',
      medicalHistory: 'Historial Médico',
      emergencyContact: 'Contacto de Emergencia',
      insurance: 'Seguro',
      labResults: 'Resultados de Laboratorio',
    },

    // Acciones Comunes
    actions: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      update: 'Actualizar',
      add: 'Agregar',
      remove: 'Quitar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      refresh: 'Actualizar',
      share: 'Compartir',
      export: 'Exportar',
      import: 'Importar',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      close: 'Cerrar',
      ok: 'OK',
      yes: 'Sí',
      no: 'No',
      enable: 'Habilitar',
      disable: 'Deshabilitar',
    },

    // Tiempo y Fechas
    time: {
      today: 'Hoy',
      tomorrow: 'Mañana',
      yesterday: 'Ayer',
      thisWeek: 'Esta Semana',
      nextWeek: 'Próxima Semana',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      night: 'Madrugada',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
      selectDate: 'Seleccionar Fecha',
      selectTime: 'Seleccionar Hora',
      duration: 'Duración',
    },

    // Configuración
    settings: {
      general: 'General',
      account: 'Cuenta',
      privacy: 'Privacidad',
      security: 'Seguridad',
      notifications: 'Notificaciones',
      language: 'Idioma',
      theme: 'Tema',
      lightMode: 'Modo Claro',
      darkMode: 'Modo Oscuro',
      systemMode: 'Modo Sistema',
      fontSize: 'Tamaño de Fuente',
      accessibility: 'Accesibilidad',
      dataManagement: 'Gestión de Datos',
      backup: 'Respaldo',
      restore: 'Restaurar',
      exportData: 'Exportar Datos',
      deleteAccount: 'Eliminar Cuenta',
    },

    // Notificaciones
    notifications: {
      medicationReminder: 'Recordatorio de Medicamento',
      appointmentReminder: 'Recordatorio de Cita',
      prescriptionReady: 'Receta Lista',
      emergencyAlert: 'Alerta de Emergencia',
      systemNotification: 'Notificación del Sistema',
      newMessage: 'Nuevo Mensaje',
      markAllRead: 'Marcar Todo como Leído',
      clearAll: 'Limpiar Todo',
      noNotifications: 'Sin notificaciones',
      enable: 'Habilitar Notificaciones',
      disable: 'Deshabilitar Notificaciones',
    },

    // Mensajes de Error
    errors: {
      genericError: 'Algo salió mal. Por favor intenta de nuevo.',
      networkError: 'Error de conexión de red. Por favor verifica tu conexión a internet.',
      timeoutError: 'La solicitud expiró. Por favor intenta de nuevo.',
      invalidInput: 'Por favor ingresa información válida.',
      requiredField: 'Este campo es requerido.',
      invalidEmail: 'Por favor ingresa una dirección de correo válida.',
      weakPassword: 'La contraseña debe tener al menos 8 caracteres.',
      passwordMismatch: 'Las contraseñas no coinciden.',
      phoneInvalid: 'Por favor ingresa un número de teléfono válido.',
      noData: 'No hay datos disponibles.',
      loadingError: 'Error cargando datos.',
      saveError: 'Error guardando datos.',
      deleteError: 'Error eliminando datos.',
      permissionDenied: 'Permiso denegado.',
      unauthorized: 'Acceso no autorizado.',
      sessionExpired: 'Sesión expirada. Por favor inicia sesión de nuevo.',
    },

    // Mensajes de Éxito
    success: {
      dataSaved: '¡Datos guardados exitosamente!',
      dataUpdated: '¡Datos actualizados exitosamente!',
      dataDeleted: '¡Datos eliminados exitosamente!',
      appointmentBooked: '¡Cita agendada exitosamente!',
      appointmentCanceled: '¡Cita cancelada exitosamente!',
      prescriptionFilled: '¡Receta surtida exitosamente!',
      profileUpdated: '¡Perfil actualizado exitosamente!',
      settingsSaved: '¡Configuración guardada exitosamente!',
      backupCreated: '¡Respaldo creado exitosamente!',
      dataExported: '¡Datos exportados exitosamente!',
      notificationSent: '¡Notificación enviada exitosamente!',
    },

    // Emergencia
    emergency: {
      callEmergency: 'Llamar Emergencia',
      emergencyContacts: 'Contactos de Emergencia',
      medicalAlert: 'Alerta Médica',
      allergyAlert: 'Alerta de Alergia',
      currentMedications: 'Medicamentos Actuales',
      medicalConditions: 'Condiciones Médicas',
      bloodType: 'Tipo de Sangre',
      emergencyInfo: 'Información de Emergencia',
      location: 'Ubicación',
      shareLocation: 'Compartir Ubicación',
    },
  },

  // Add more languages as needed (French, Portuguese, etc.)
  fr: {
    // Authentication
    auth: {
      signIn: 'Se Connecter',
      signUp: 'S\'inscrire',
      signOut: 'Se Déconnecter',
      email: 'Email',
      password: 'Mot de Passe',
      confirmPassword: 'Confirmer le Mot de Passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      phoneNumber: 'Numéro de Téléphone',
      forgotPassword: 'Mot de passe oublié?',
      resetPassword: 'Réinitialiser le Mot de Passe',
      createAccount: 'Créer un Compte',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      dontHaveAccount: 'Vous n\'avez pas de compte?',
      invalidCredentials: 'Email ou mot de passe invalide',
      signInSuccess: 'Connexion réussie!',
      signUpSuccess: 'Compte créé avec succès!',
      passwordResetSent: 'Email de réinitialisation envoyé',
      loading: 'Veuillez patienter...',
    },
    // Add more French translations as needed...
  },
};

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Translation helper function
export const translate = (key, language = DEFAULT_LANGUAGE, params = {}) => {
  const keys = key.split('.');
  let translation = translations[language];
  
  // Navigate through nested keys
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k];
    } else {
      // Fallback to English if translation not found
      translation = translations[DEFAULT_LANGUAGE];
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return key if no translation found
        }
      }
      break;
    }
  }
  
  // Replace parameters in translation
  if (typeof translation === 'string' && Object.keys(params).length > 0) {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  
  return translation || key;
};

// Short alias for translate function
export const t = translate;

export default {
  translations,
  translate,
  t,
  DEFAULT_LANGUAGE,
  AVAILABLE_LANGUAGES,
};