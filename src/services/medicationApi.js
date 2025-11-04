// Medication API Service with drug information and image fetching
import AsyncStorage from '@react-native-async-storage/async-storage';

const FDA_API_BASE = 'https://api.fda.gov/drug';
const OPENFDA_LABEL_API = `${FDA_API_BASE}/label.json`;
const OPENFDA_NDC_API = `${FDA_API_BASE}/ndc.json`;

// Google Custom Search API configuration
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with actual API key
const GOOGLE_SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID'; // Replace with actual search engine ID
const GOOGLE_CUSTOM_SEARCH_API = 'https://www.googleapis.com/customsearch/v1';

class MedicationApiService {
  constructor() {
    this.cache = new Map();
    this.loadCacheFromStorage();
  }

  async loadCacheFromStorage() {
    try {
      const cachedData = await AsyncStorage.getItem('medicationCache');
      if (cachedData) {
        this.cache = new Map(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('Error loading medication cache:', error);
    }
  }

  async saveCacheToStorage() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      await AsyncStorage.setItem('medicationCache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Error saving medication cache:', error);
    }
  }

  // Search medications using FDA OpenFDA API
  async searchMedications(query, limit = 20) {
    try {
      const cacheKey = `search_${query}_${limit}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const searchUrl = `${OPENFDA_LABEL_API}?search=openfda.brand_name:"${encodeURIComponent(query)}"*+openfda.generic_name:"${encodeURIComponent(query)}"*&limit=${limit}`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.results) {
        const medications = await Promise.all(
          data.results.map(async (item) => {
            const medication = await this.processMedicationData(item);
            // Get medication image
            medication.image = await this.getMedicationImage(medication.name);
            return medication;
          })
        );

        // Cache the results
        this.cache.set(cacheKey, medications);
        this.saveCacheToStorage();
        
        return medications;
      }

      return [];
    } catch (error) {
      console.error('Error searching medications:', error);
      // Return mock data if API fails
      return this.getMockMedications(query);
    }
  }

  // Get detailed medication information
  async getMedicationDetails(drugId) {
    try {
      const cacheKey = `details_${drugId}`;
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const detailsUrl = `${OPENFDA_LABEL_API}?search=set_id:${drugId}&limit=1`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const medicationDetails = await this.processMedicationData(data.results[0], true);
        medicationDetails.image = await this.getMedicationImage(medicationDetails.name);
        
        this.cache.set(cacheKey, medicationDetails);
        this.saveCacheToStorage();
        
        return medicationDetails;
      }

      return null;
    } catch (error) {
      console.error('Error getting medication details:', error);
      return null;
    }
  }

  // Process FDA API medication data
  async processMedicationData(item, detailed = false) {
    const openfda = item.openfda || {};
    const brandName = openfda.brand_name ? openfda.brand_name[0] : 'Unknown';
    const genericName = openfda.generic_name ? openfda.generic_name[0] : 'Unknown';
    
    const medication = {
      id: item.set_id || Math.random().toString(36).substr(2, 9),
      name: brandName,
      genericName: genericName,
      manufacturer: openfda.manufacturer_name ? openfda.manufacturer_name[0] : 'Unknown',
      dosageForm: openfda.dosage_form ? openfda.dosage_form[0] : 'Unknown',
      route: openfda.route ? openfda.route[0] : 'Unknown',
      strength: openfda.substance_name ? openfda.substance_name.join(', ') : 'Unknown',
      ndc: openfda.product_ndc ? openfda.product_ndc[0] : null,
      rxcui: openfda.rxcui ? openfda.rxcui[0] : null,
      price: this.generateMockPrice(), // Mock price since FDA API doesn't provide pricing
      inStock: Math.random() > 0.2, // Mock stock status
      stockQuantity: Math.floor(Math.random() * 100) + 10,
      category: this.categorizeByRoute(openfda.route ? openfda.route[0] : 'oral'),
      prescriptionRequired: this.isPrescriptionRequired(openfda.product_type),
      createdAt: new Date().toISOString()
    };

    if (detailed) {
      medication.description = item.description ? item.description[0] : 'No description available';
      medication.indications = item.indications_and_usage ? item.indications_and_usage[0] : 'No indications available';
      medication.dosage = item.dosage_and_administration ? item.dosage_and_administration[0] : 'Consult healthcare provider';
      medication.warnings = item.warnings ? item.warnings[0] : 'No warnings available';
      medication.sideEffects = item.adverse_reactions ? item.adverse_reactions[0] : 'No side effects listed';
      medication.contraindications = item.contraindications ? item.contraindications[0] : 'No contraindications listed';
    }

    return medication;
  }

  // Get medication image using Google Custom Search API
  async getMedicationImage(medicationName) {
    try {
      const cacheKey = `image_${medicationName}`;
      
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // If Google API is not configured, return placeholder
      if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
        const placeholderImage = this.getPlaceholderImage(medicationName);
        this.cache.set(cacheKey, placeholderImage);
        return placeholderImage;
      }

      const searchQuery = `${medicationName} medication pill tablet`;
      const searchUrl = `${GOOGLE_CUSTOM_SEARCH_API}?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=active`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const imageUrl = data.items[0].link;
        this.cache.set(cacheKey, imageUrl);
        this.saveCacheToStorage();
        return imageUrl;
      }

      // Fallback to placeholder
      const placeholderImage = this.getPlaceholderImage(medicationName);
      this.cache.set(cacheKey, placeholderImage);
      return placeholderImage;
      
    } catch (error) {
      console.error('Error fetching medication image:', error);
      return this.getPlaceholderImage(medicationName);
    }
  }

  // Generate placeholder image URL based on medication name
  getPlaceholderImage(medicationName) {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F'];
    const colorIndex = medicationName.length % colors.length;
    const color = colors[colorIndex];
    const initials = medicationName.substring(0, 2).toUpperCase();
    
    return `https://via.placeholder.com/200x200/${color}/FFFFFF?text=${initials}`;
  }

  // Helper methods
  categorizeByRoute(route) {
    const routeLower = route.toLowerCase();
    if (routeLower.includes('oral')) return 'Oral';
    if (routeLower.includes('topical')) return 'Topical';
    if (routeLower.includes('injection')) return 'Injectable';
    if (routeLower.includes('inhalation')) return 'Inhalation';
    return 'Other';
  }

  isPrescriptionRequired(productType) {
    if (!productType) return true;
    const type = productType[0]?.toLowerCase() || '';
    return !type.includes('otc') && !type.includes('over the counter');
  }

  generateMockPrice() {
    return (Math.random() * 200 + 10).toFixed(2);
  }

  // Mock medications for fallback
  getMockMedications(query = '') {
    const mockMeds = [
      {
        id: '1',
        name: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        manufacturer: 'Bayer',
        dosageForm: 'Tablet',
        route: 'Oral',
        strength: '325mg',
        price: '12.99',
        inStock: true,
        stockQuantity: 50,
        category: 'Oral',
        prescriptionRequired: false,
        image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=AS'
      },
      {
        id: '2',
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        manufacturer: 'Pfizer',
        dosageForm: 'Capsule',
        route: 'Oral',
        strength: '500mg',
        price: '24.50',
        inStock: true,
        stockQuantity: 30,
        category: 'Oral',
        prescriptionRequired: true,
        image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=AM'
      },
      {
        id: '3',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        manufacturer: 'Advil',
        dosageForm: 'Tablet',
        route: 'Oral',
        strength: '200mg',
        price: '8.99',
        inStock: true,
        stockQuantity: 75,
        category: 'Oral',
        prescriptionRequired: false,
        image: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=IB'
      }
    ];

    if (query) {
      return mockMeds.filter(med => 
        med.name.toLowerCase().includes(query.toLowerCase()) ||
        med.genericName.toLowerCase().includes(query.toLowerCase())
      );
    }

    return mockMeds;
  }

  // Clear cache
  async clearCache() {
    this.cache.clear();
    try {
      await AsyncStorage.removeItem('medicationCache');
    } catch (error) {
      console.error('Error clearing medication cache:', error);
    }
  }
}

export default new MedicationApiService();