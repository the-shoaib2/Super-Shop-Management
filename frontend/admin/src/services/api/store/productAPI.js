import api from '../../config/config';

export const productAPI = {
  getProducts: async (storeId, params = {}) => {
    try {
      if (!storeId) {
        return {
          success: false,
          message: 'No store ID provided',
          data: null
        };
      }
      const response = await api.get(`/api/stores/${storeId}/products`, { params });
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get products error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
        data: [],
        error
      };
    }
  },

  getProductsbyIds: async (productId) => {
    try {
      if (!productId) {
        return {
          success: false,
          message: 'No product ID provided',
          data: null
        };
      }

      const response = await api.get(`/api/products/${productId}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get product by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product',
        data: null,
        error
      };
    }
  },

  createStoreProduct: async (storeId, productData) => {
    try {
      const response = await api.post(`/api/stores/${storeId}/products`, productData);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Create product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create product',
        data: null,
        error
      };
    }
  },

  updateProduct: async (productId, data) => {
    try {
      const response = await api.put(`/api/products/${productId}`, data);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Product updated successfully'
      };
    } catch (error) {
      console.error('Update product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product',
        data: null,
        error
      };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Delete product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product',
        data: null,
        error
      };
    }
  },

  uploadProductImages: async (files, folder = 'products') => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', folder);

      const response = await api.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Upload images error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload images',
        data: null,
        error
      };
    }
  },

  updateStoreProduct: async (storeId, productId, data) => {
    try {
      const response = await api.put(`/api/stores/${storeId}/products/${productId}`, data);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Product updated successfully'
      };
    } catch (error) {
      console.error('Update store product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product',
        data: null,
        error
      };
    }
  },

  deleteStoreProduct: async (storeId, productId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/products/${productId}`);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Product deleted successfully'
      };
    } catch (error) {
      console.error('Delete store product error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product',
        data: null,
        error
      };
    }
  },

  getActivePrices: async (storeId) => {
    try {
      if (!storeId) {
        return {
          success: false,
          message: 'No store ID provided',
          data: []
        };
      }

      const response = await api.get(`/api/stores/${storeId}/prices`);
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
        data: [],
        error
      };
    }
  }
};

export default productAPI; 