import api from '../config';

export const storeAPI = {
  getOwnerStores: async () => {
    try {
      const response = await api.get('/api/stores/owner/stores');
      return {
        success: true,
        data: response.data?.data || []
      };
    } catch (error) {
      console.error('Get stores error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stores',
        error
      };
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

  getStoreProducts: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/products`);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  getStoreColors: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/colors`);
      return response.data;
    } catch (error) {
      console.error('Get colors error:', error);
      throw error;
    }
  },

  addStoreColor: async (storeId, colorData) => {
    try {
      if (!storeId) {
        return {
          success: false,
          message: 'Store ID is required'
        }
      }

      const response = await api.post(`/api/stores/${storeId}/colors`, colorData)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Add color error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add color',
        error
      }
    }
  },

  updateStoreColor: async (storeId, colorId, colorData) => {
    try {
      if (!storeId || !colorId) {
        return {
          success: false,
          message: 'Store ID and Color ID are required'
        }
      }

      const response = await api.put(`/api/stores/${storeId}/colors/${colorId}`, colorData)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Update color error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update color',
        error
      }
    }
  },

  deleteStoreColor: async (storeId, colorId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/colors/${colorId}`);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Delete color error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete color',
        error
      };
    }
  },

  getStoreSizes: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/sizes`);
      return response.data;
    } catch (error) {
      console.error('Get sizes error:', error);
      throw error;
    }
  },

  addStoreSize: async (storeId, sizeData) => {
    try {
      if (!storeId) {
        return {
          success: false,
          message: 'Store ID is required'
        }
      }

      const response = await api.post(`/api/stores/${storeId}/sizes`, sizeData)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Add size error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add size',
        error
      }
    }
  },

  updateStoreSize: async (storeId, sizeId, sizeData) => {
    try {
      if (!storeId || !sizeId) {
        return {
          success: false,
          message: 'Store ID and Size ID are required'
        }
      }

      const response = await api.put(`/api/stores/${storeId}/sizes/${sizeId}`, sizeData)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Update size error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update size',
        error
      }
    }
  },

  deleteStoreSize: async (storeId, sizeId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/sizes/${sizeId}`);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Delete size error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete size',
        error
      };
    }
  },

  getStoreCategories: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/categories`);
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  addStoreCategory: async (categoryData) => {
    try {
      const response = await api.post(`/api/stores/${categoryData.storeId}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  },

  getStoreBillboards: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/billboards`);
      return response.data;
    } catch (error) {
      console.error('Get billboards error:', error);
      throw error;
    }
  },

  addStoreBillboard: async (billboardData) => {
    try {
      const response = await api.post(`/api/stores/${billboardData.storeId}/billboards`, billboardData);
      return response.data;
    } catch (error) {
      console.error('Add billboard error:', error);
      throw error;
    }
  },

  getStoreSettings: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/settings`);
      return response.data;
    } catch (error) {
      console.error('Get store settings error:', error);
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

  switchStore: async (storeId) => {
    try {
      const response = await api.post(`/api/stores/owner/stores/${storeId}/switch`);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Switch store error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to switch store',
        error
      };
    }
  }
};

export default storeAPI; 