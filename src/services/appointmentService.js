// Appointment Service for managing appointments between doctors and patients
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppointmentService {
  constructor() {
    this.appointments = [];
    this.availableSlots = [];
    this.appointmentTypes = [
      'General Consultation',
      'Follow-up',
      'Routine Check-up',
      'Vaccination',
      'Health Screening',
      'Prescription Renewal',
      'Specialist Consultation',
      'Emergency Consultation'
    ];
    this.loadData();
  }

  async loadData() {
    try {
      const [appointmentsData, slotsData] = await Promise.all([
        AsyncStorage.getItem('appointments'),
        AsyncStorage.getItem('availableSlots')
      ]);

      if (appointmentsData) {
        this.appointments = JSON.parse(appointmentsData);
      } else {
        this.appointments = this.getMockAppointments();
        await this.saveAppointments();
      }

      if (slotsData) {
        this.availableSlots = JSON.parse(slotsData);
      } else {
        this.availableSlots = this.generateAvailableSlots();
        await this.saveSlots();
      }
    } catch (error) {
      console.error('Error loading appointment data:', error);
      this.appointments = this.getMockAppointments();
      this.availableSlots = this.generateAvailableSlots();
    }
  }

  async saveAppointments() {
    try {
      await AsyncStorage.setItem('appointments', JSON.stringify(this.appointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  }

  async saveSlots() {
    try {
      await AsyncStorage.setItem('availableSlots', JSON.stringify(this.availableSlots));
    } catch (error) {
      console.error('Error saving slots:', error);
    }
  }

  // Patient Methods
  async bookAppointment(appointmentData) {
    try {
      const newAppointment = {
        id: `APT${Date.now()}`,
        patientId: appointmentData.patientId,
        patientName: appointmentData.patientName,
        doctorId: appointmentData.doctorId,
        doctorName: appointmentData.doctorName,
        doctorSpecialization: appointmentData.doctorSpecialization,
        appointmentType: appointmentData.appointmentType,
        date: appointmentData.date,
        time: appointmentData.time,
        duration: appointmentData.duration || 30, // minutes
        reason: appointmentData.reason || '',
        symptoms: appointmentData.symptoms || '',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patientPhone: appointmentData.patientPhone,
        patientEmail: appointmentData.patientEmail,
        consultationType: appointmentData.consultationType || 'in-person', // in-person, video, phone
        priority: appointmentData.priority || 'normal', // urgent, high, normal, low
        notes: ''
      };

      // Check if slot is available
      const slotKey = `${appointmentData.doctorId}_${appointmentData.date}_${appointmentData.time}`;
      const isSlotAvailable = this.availableSlots.some(
        slot => slot.key === slotKey && slot.available
      );

      if (!isSlotAvailable) {
        throw new Error('Selected time slot is no longer available');
      }

      // Mark slot as unavailable
      const slotIndex = this.availableSlots.findIndex(slot => slot.key === slotKey);
      if (slotIndex !== -1) {
        this.availableSlots[slotIndex].available = false;
        this.availableSlots[slotIndex].appointmentId = newAppointment.id;
      }

      this.appointments.push(newAppointment);
      await Promise.all([this.saveAppointments(), this.saveSlots()]);

      return { success: true, appointment: newAppointment };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { success: false, error: error.message };
    }
  }

  async getPatientAppointments(patientId, status = 'all') {
    let appointments = this.appointments.filter(apt => apt.patientId === patientId);
    
    if (status !== 'all') {
      appointments = appointments.filter(apt => apt.status === status);
    }

    return appointments
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
      .map(apt => ({
        ...apt,
        isUpcoming: new Date(`${apt.date} ${apt.time}`) > new Date(),
        isPast: new Date(`${apt.date} ${apt.time}`) < new Date()
      }));
  }

  async cancelAppointment(appointmentId, userId, userRole, reason = '') {
    try {
      const appointmentIndex = this.appointments.findIndex(apt => apt.id === appointmentId);
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found');
      }

      const appointment = this.appointments[appointmentIndex];
      
      // Check authorization
      if (userRole === 'patient' && appointment.patientId !== userId) {
        throw new Error('Unauthorized to cancel this appointment');
      }
      if (userRole === 'doctor' && appointment.doctorId !== userId) {
        throw new Error('Unauthorized to cancel this appointment');
      }

      // Update appointment status
      this.appointments[appointmentIndex] = {
        ...appointment,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelledBy: userRole,
        cancellationReason: reason,
        updatedAt: new Date().toISOString()
      };

      // Free up the slot
      const slotKey = `${appointment.doctorId}_${appointment.date}_${appointment.time}`;
      const slotIndex = this.availableSlots.findIndex(slot => slot.key === slotKey);
      if (slotIndex !== -1) {
        this.availableSlots[slotIndex].available = true;
        this.availableSlots[slotIndex].appointmentId = null;
      }

      await Promise.all([this.saveAppointments(), this.saveSlots()]);

      return { success: true, appointment: this.appointments[appointmentIndex] };
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return { success: false, error: error.message };
    }
  }

  // Doctor Methods
  async getDoctorAppointments(doctorId, date = null, status = 'all') {
    let appointments = this.appointments.filter(apt => apt.doctorId === doctorId);
    
    if (date) {
      appointments = appointments.filter(apt => apt.date === date);
    }
    
    if (status !== 'all') {
      appointments = appointments.filter(apt => apt.status === status);
    }

    return appointments
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
      })
      .map(apt => ({
        ...apt,
        isToday: apt.date === new Date().toISOString().split('T')[0],
        isUpcoming: new Date(`${apt.date} ${apt.time}`) > new Date(),
        isPast: new Date(`${apt.date} ${apt.time}`) < new Date()
      }));
  }

  async updateAppointment(appointmentId, updates, userId, userRole) {
    try {
      const appointmentIndex = this.appointments.findIndex(apt => apt.id === appointmentId);
      if (appointmentIndex === -1) {
        throw new Error('Appointment not found');
      }

      const appointment = this.appointments[appointmentIndex];
      
      // Check authorization
      if (userRole === 'patient' && appointment.patientId !== userId) {
        throw new Error('Unauthorized to update this appointment');
      }
      if (userRole === 'doctor' && appointment.doctorId !== userId) {
        throw new Error('Unauthorized to update this appointment');
      }

      this.appointments[appointmentIndex] = {
        ...appointment,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.saveAppointments();

      return { success: true, appointment: this.appointments[appointmentIndex] };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }
  }

  async addAppointmentNotes(appointmentId, notes, doctorId) {
    return this.updateAppointment(appointmentId, { notes }, doctorId, 'doctor');
  }

  async completeAppointment(appointmentId, doctorId, diagnosis = '', prescription = '') {
    return this.updateAppointment(
      appointmentId, 
      { 
        status: 'completed',
        completedAt: new Date().toISOString(),
        diagnosis,
        prescription
      }, 
      doctorId, 
      'doctor'
    );
  }

  // Slot Management
  async getAvailableSlots(doctorId, date) {
    return this.availableSlots.filter(
      slot => slot.doctorId === doctorId && slot.date === date && slot.available
    ).sort((a, b) => a.time.localeCompare(b.time));
  }

  async getDoctorSchedule(doctorId, startDate, endDate) {
    const schedule = {};
    
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const slots = await this.getAvailableSlots(doctorId, dateStr);
      const appointments = await this.getDoctorAppointments(doctorId, dateStr, 'scheduled');
      
      schedule[dateStr] = {
        availableSlots: slots.length,
        totalSlots: this.availableSlots.filter(
          slot => slot.doctorId === doctorId && slot.date === dateStr
        ).length,
        appointments: appointments.length,
        appointmentDetails: appointments
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return schedule;
  }

  // Utility Methods
  getAppointmentTypes() {
    return this.appointmentTypes;
  }

  async getAppointmentById(appointmentId) {
    return this.appointments.find(apt => apt.id === appointmentId);
  }

  async searchAppointments(query, userId, userRole) {
    let appointments = [];
    
    if (userRole === 'patient') {
      appointments = this.appointments.filter(apt => apt.patientId === userId);
    } else if (userRole === 'doctor') {
      appointments = this.appointments.filter(apt => apt.doctorId === userId);
    }

    return appointments.filter(apt =>
      apt.patientName.toLowerCase().includes(query.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(query.toLowerCase()) ||
      apt.appointmentType.toLowerCase().includes(query.toLowerCase()) ||
      apt.reason.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Analytics
  async getAppointmentStats(userId, userRole) {
    let appointments = [];
    
    if (userRole === 'patient') {
      appointments = this.appointments.filter(apt => apt.patientId === userId);
    } else if (userRole === 'doctor') {
      appointments = this.appointments.filter(apt => apt.doctorId === userId);
    }

    const total = appointments.length;
    const scheduled = appointments.filter(apt => apt.status === 'scheduled').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(apt => apt.date === today).length;
    
    return {
      total,
      scheduled,
      completed,
      cancelled,
      todaysAppointments,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0
    };
  }

  // Generate available slots for doctors
  generateAvailableSlots() {
    const slots = [];
    const doctorIds = ['1']; // Add more doctor IDs as needed
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    
    // Generate slots for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      doctorIds.forEach(doctorId => {
        timeSlots.forEach(time => {
          slots.push({
            key: `${doctorId}_${dateStr}_${time}`,
            doctorId,
            date: dateStr,
            time,
            available: true,
            appointmentId: null
          });
        });
      });
    }
    
    return slots;
  }

  getMockAppointments() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
      {
        id: 'APT001',
        patientId: '2',
        patientName: 'Jane Doe',
        doctorId: '1',
        doctorName: 'Dr. John Smith',
        doctorSpecialization: 'General Medicine',
        appointmentType: 'General Consultation',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00',
        duration: 30,
        reason: 'Routine check-up',
        symptoms: 'Mild headache, fatigue',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patientPhone: '+1234567891',
        patientEmail: 'jane@example.com',
        consultationType: 'in-person',
        priority: 'normal',
        notes: ''
      }
    ];
  }
}

export default new AppointmentService();