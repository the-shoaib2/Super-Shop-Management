import api from '../config';

export const priceAPI = {
  // Get all prices for a store
  getPrices: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/prices`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get prices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch prices',
        error
      };
    }
  },

  // Create new price
  createPrice: async (storeId, priceData) => {
    try {
      const response = await api.post(`/api/stores/${storeId}/prices`, priceData);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Create price error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create price',
        error
      };
    }
  },

  // Update price
  updatePrice: async (storeId, priceId, priceData) => {
    try {
      const response = await api.put(`/api/stores/${storeId}/prices/${priceId}`, priceData);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Update price error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update price',
        error
      };
    }
  },

  // Delete price
  deletePrice: async (storeId, priceId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/prices/${priceId}`);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Delete price error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete price',
        error
      };
    }
  },

  // Add discount to price
  addDiscount: async (storeId, priceId, discountData) => {
    try {
      const response = await api.post(`/api/stores/${storeId}/prices/${priceId}/discount`, discountData);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Add discount error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add discount',
        error
      };
    }
  },

  // Remove discount from price
  removeDiscount: async (storeId, priceId, currencyCode) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/prices/${priceId}/discount/${currencyCode}`);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Remove discount error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove discount',
        error
      };
    }
  },

  // Get prices for specific product
  getProductPrices: async (storeId, productId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/prices/products/${productId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get product prices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product prices',
        error
      };
    }
  },

  // Get active prices
  getActivePrices: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/prices/active`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get active prices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active prices',
        error
      };
    }
  },

  // Get discounted prices
  getDiscountedPrices: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/prices/discounted`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get discounted prices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch discounted prices',
        error
      };
    }
  }
};

export default priceAPI; 