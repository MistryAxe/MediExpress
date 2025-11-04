// Pharmacy Service for order management, inventory, and processing
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicationApi from './medicationApi';

class PharmacyService {
  constructor() {
    this.orders = [];
    this.inventory = [];
    this.rejectionReasons = [
      'Out of stock',
      'Invalid prescription',
      'Expired prescription',
      'Dosage concerns',
      'Drug interaction warning',
      'Patient allergy concerns',
      'Insurance coverage issue',
      'Quantity exceeds limit',
      'Requires prior authorization',
      'Other (specify)'
    ];
    this.loadData();
  }

  async loadData() {
    try {
      const [ordersData, inventoryData] = await Promise.all([
        AsyncStorage.getItem('pharmacyOrders'),
        AsyncStorage.getItem('pharmacyInventory')
      ]);

      if (ordersData) {
        this.orders = JSON.parse(ordersData);
      } else {
        this.orders = this.getMockOrders();
        await this.saveOrders();
      }

      if (inventoryData) {
        this.inventory = JSON.parse(inventoryData);
      } else {
        this.inventory = await this.initializeInventory();
        await this.saveInventory();
      }
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
      this.orders = this.getMockOrders();
      this.inventory = await this.initializeInventory();
    }
  }

  async saveOrders() {
    try {
      await AsyncStorage.setItem('pharmacyOrders', JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  async saveInventory() {
    try {
      await AsyncStorage.setItem('pharmacyInventory', JSON.stringify(this.inventory));
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  }

  // Order Management
  async getOrders(status = 'all', pharmacyId = null) {
    let filteredOrders = this.orders;

    if (pharmacyId) {
      filteredOrders = filteredOrders.filter(order => order.pharmacyId === pharmacyId);
    }

    if (status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    return filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getPendingOrders(pharmacyId) {
    return this.getOrders('pending', pharmacyId);
  }

  async getOrderById(orderId) {
    return this.orders.find(order => order.id === orderId);
  }

  async approveOrder(orderId, pharmacyId, notes = '') {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = this.orders[orderIndex];
      if (order.pharmacyId !== pharmacyId) {
        throw new Error('Unauthorized to modify this order');
      }

      // Check inventory availability
      const inventoryCheck = await this.checkInventoryAvailability(order.items);
      if (!inventoryCheck.available) {
        throw new Error(`Insufficient stock: ${inventoryCheck.missingItems.join(', ')}`);
      }

      // Update inventory
      await this.updateInventoryForOrder(order.items, 'subtract');

      // Update order status
      this.orders[orderIndex] = {
        ...order,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        pharmacyNotes: notes,
        estimatedDelivery: this.calculateDeliveryDate()
      };

      await this.saveOrders();
      await this.saveInventory();

      return { success: true, order: this.orders[orderIndex] };
    } catch (error) {
      console.error('Error approving order:', error);
      return { success: false, error: error.message };
    }
  }

  async rejectOrder(orderId, pharmacyId, reason, customReason = '') {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = this.orders[orderIndex];
      if (order.pharmacyId !== pharmacyId) {
        throw new Error('Unauthorized to modify this order');
      }

      const rejectionReason = reason === 'Other (specify)' ? customReason : reason;

      this.orders[orderIndex] = {
        ...order,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: rejectionReason,
        pharmacyNotes: `Rejected: ${rejectionReason}`
      };

      await this.saveOrders();

      return { success: true, order: this.orders[orderIndex] };
    } catch (error) {
      console.error('Error rejecting order:', error);
      return { success: false, error: error.message };
    }
  }

  // Inventory Management
  async getInventory(pharmacyId, searchQuery = '') {
    let inventory = this.inventory.filter(item => item.pharmacyId === pharmacyId);

    if (searchQuery) {
      inventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genericName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return inventory.sort((a, b) => a.name.localeCompare(b.name));
  }

  async addMedicationToInventory(pharmacyId, medicationData) {
    try {
      const newInventoryItem = {
        id: Date.now().toString(),
        pharmacyId,
        medicationId: medicationData.medicationId || medicationData.id,
        name: medicationData.name,
        genericName: medicationData.genericName,
        manufacturer: medicationData.manufacturer,
        dosageForm: medicationData.dosageForm,
        strength: medicationData.strength,
        quantity: parseInt(medicationData.quantity) || 0,
        unitPrice: parseFloat(medicationData.unitPrice) || 0,
        expiryDate: medicationData.expiryDate,
        batchNumber: medicationData.batchNumber || `BATCH${Date.now()}`,
        minimumStock: parseInt(medicationData.minimumStock) || 10,
        image: medicationData.image,
        category: medicationData.category || 'General',
        prescriptionRequired: medicationData.prescriptionRequired || false,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.inventory.push(newInventoryItem);
      await this.saveInventory();

      return { success: true, item: newInventoryItem };
    } catch (error) {
      console.error('Error adding medication to inventory:', error);
      return { success: false, error: error.message };
    }
  }

  async updateInventoryItem(itemId, updates) {
    try {
      const itemIndex = this.inventory.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error('Inventory item not found');
      }

      this.inventory[itemIndex] = {
        ...this.inventory[itemIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.saveInventory();
      return { success: true, item: this.inventory[itemIndex] };
    } catch (error) {
      console.error('Error updating inventory item:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteInventoryItem(itemId, pharmacyId) {
    try {
      const itemIndex = this.inventory.findIndex(
        item => item.id === itemId && item.pharmacyId === pharmacyId
      );
      
      if (itemIndex === -1) {
        throw new Error('Inventory item not found');
      }

      const deletedItem = this.inventory.splice(itemIndex, 1)[0];
      await this.saveInventory();

      return { success: true, deletedItem };
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      return { success: false, error: error.message };
    }
  }

  async getLowStockItems(pharmacyId) {
    return this.inventory.filter(
      item => item.pharmacyId === pharmacyId && item.quantity <= item.minimumStock
    );
  }

  async getExpiringItems(pharmacyId, daysUntilExpiry = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry);

    return this.inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return item.pharmacyId === pharmacyId && expiryDate <= cutoffDate;
    });
  }

  // Helper Methods
  async checkInventoryAvailability(orderItems) {
    const missingItems = [];
    
    for (const orderItem of orderItems) {
      const inventoryItem = this.inventory.find(
        item => item.medicationId === orderItem.medicationId
      );
      
      if (!inventoryItem || inventoryItem.quantity < orderItem.quantity) {
        missingItems.push(orderItem.name);
      }
    }

    return {
      available: missingItems.length === 0,
      missingItems
    };
  }

  async updateInventoryForOrder(orderItems, action = 'subtract') {
    for (const orderItem of orderItems) {
      const inventoryIndex = this.inventory.findIndex(
        item => item.medicationId === orderItem.medicationId
      );
      
      if (inventoryIndex !== -1) {
        const currentQuantity = this.inventory[inventoryIndex].quantity;
        const newQuantity = action === 'subtract' 
          ? currentQuantity - orderItem.quantity
          : currentQuantity + orderItem.quantity;
        
        this.inventory[inventoryIndex].quantity = Math.max(0, newQuantity);
        this.inventory[inventoryIndex].updatedAt = new Date().toISOString();
      }
    }
  }

  calculateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 1); // 1-3 days
    return deliveryDate.toISOString();
  }

  getRejectionReasons() {
    return this.rejectionReasons;
  }

  // Analytics
  async getPharmacyAnalytics(pharmacyId) {
    const orders = await this.getOrders('all', pharmacyId);
    const inventory = await this.getInventory(pharmacyId);
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const approvedOrders = orders.filter(order => order.status === 'approved').length;
    const rejectedOrders = orders.filter(order => order.status === 'rejected').length;
    const totalRevenue = orders
      .filter(order => order.status === 'approved')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    const lowStockItems = await this.getLowStockItems(pharmacyId);
    const expiringItems = await this.getExpiringItems(pharmacyId);
    
    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      approvalRate: totalOrders > 0 ? (approvedOrders / totalOrders * 100).toFixed(1) : 0,
      totalRevenue: totalRevenue.toFixed(2),
      totalInventoryItems: inventory.length,
      lowStockItemsCount: lowStockItems.length,
      expiringItemsCount: expiringItems.length
    };
  }

  // Initialize with sample data
  async initializeInventory() {
    const sampleMedications = await medicationApi.getMockMedications();
    return sampleMedications.map((med, index) => ({
      id: `inv_${index + 1}`,
      pharmacyId: '3', // Default pharmacy ID
      medicationId: med.id,
      name: med.name,
      genericName: med.genericName,
      manufacturer: med.manufacturer,
      dosageForm: med.dosageForm,
      strength: med.strength,
      quantity: Math.floor(Math.random() * 100) + 20,
      unitPrice: parseFloat(med.price),
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchNumber: `BATCH${1000 + index}`,
      minimumStock: 10,
      image: med.image,
      category: med.category,
      prescriptionRequired: med.prescriptionRequired,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  getMockOrders() {
    return [
      {
        id: 'ORD001',
        patientId: '2',
        patientName: 'Jane Doe',
        doctorId: '1',
        doctorName: 'Dr. John Smith',
        pharmacyId: '3',
        items: [
          {
            medicationId: '1',
            name: 'Aspirin',
            quantity: 1,
            unitPrice: 12.99,
            totalPrice: 12.99
          }
        ],
        totalAmount: 12.99,
        status: 'pending',
        orderType: 'prescription',
        prescriptionId: 'RX001',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        deliveryAddress: '123 Main St, City, State 12345',
        contactNumber: '+1234567891'
      },
      {
        id: 'ORD002',
        patientId: '2',
        patientName: 'Jane Doe',
        pharmacyId: '3',
        items: [
          {
            medicationId: '3',
            name: 'Ibuprofen',
            quantity: 2,
            unitPrice: 8.99,
            totalPrice: 17.98
          }
        ],
        totalAmount: 17.98,
        status: 'pending',
        orderType: 'otc',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        deliveryAddress: '123 Main St, City, State 12345',
        contactNumber: '+1234567891'
      }
    ];
  }
}

export default new PharmacyService();