import api from '../config';

export const storeAPI = {
  getOwnerStores: async () => {
    try {
      const response = await api.get('/api/stores/owner/stores');
      return response.data;
    } catch (error) {
      console.error('Get stores error:', error);
      throw error;
    }
  },

  getCurrentStore: async () => {
    try {
      const response = await api.get('/api/stores/owner/current');
      return response.data;
    } catch (error) {
      console.error('Get current store error:', error);
      throw error;
    }
  },

  createStore: async (storeData) => {
    try {
      const response = await api.post('/api/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('Create store error:', error);
      throw error;
    }
  },

  updateStore: async (storeId, data) => {
    try {
      const response = await api.put(`/api/stores/${storeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update store error:', error);
      throw error;
    }
  },

  deleteStore: async (storeId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Delete store error:', error);
      throw error;
    }
  },

  getStoreSettings: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/settings`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get store settings error:', error);
      return {
        success: false,
        data: {
          name: '',
          description: '',
          address: '',
          location: '',
          phone: '',
          email: '',
          active: true
        },
        error: error.response?.data?.message || 'Failed to get store settings'
      };
    }
  }
};

export default storeAPI; 