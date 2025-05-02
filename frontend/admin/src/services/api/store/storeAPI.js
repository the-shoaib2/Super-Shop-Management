import api from '../../config/config';

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
      return {
        success: true,
        data: response.data?.data || []
      };
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch categories',
        error
      };
    }
  },

  createStoreCategory: async (storeId, categoryData) => {
    try {
      const response = await api.post(`/api/stores/${storeId}/categories`, categoryData);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create category',
        error
      };
    }
  },

  updateStoreCategory: async (storeId, categoryId, categoryData) => {
    try {
      const response = await api.put(`/api/stores/${storeId}/categories/${categoryId}`, categoryData);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Update category error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update category',
        error
      };
    }
  },

  deleteStoreCategory: async (storeId, categoryId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/categories/${categoryId}`);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Delete category error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete category',
        error
      };
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

  createStoreBillboard: async (storeId, billboardData) => {
    try {
      const response = await api.post(`/api/stores/${storeId}/billboards`, billboardData);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Create billboard error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create billboard',
        error
      };
    }
  },

  updateStoreBillboard: async (storeId, billboardId, billboardData) => {
    try {
      const response = await api.put(`/api/stores/${storeId}/billboards/${billboardId}`, billboardData);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Update billboard error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update billboard',
        error
      };
    }
  },

  deleteStoreBillboard: async (storeId, billboardId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/billboards/${billboardId}`);
      return {
        success: true,
        data: response.data?.data
      };
    } catch (error) {
      console.error('Delete billboard error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete billboard',
        error
      };
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

  getDashboardStats: async (storeId) => {
    try {
      const response = await api.get(`/stores/${storeId}/stats`);
      return {
        success: true,
        data: response.data?.data || {
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  switchStore: async (storeId) => {
    try {
      const response = await api.post(`/api/stores/owner/stores/${storeId}/switch`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Switch store error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default storeAPI; 