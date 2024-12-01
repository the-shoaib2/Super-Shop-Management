import api from '../config';

export const productAPI = {
  getProducts: async (storeId, params = {}) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/products`, { params });
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  getProduct: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/products', productData);
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
        error
      };
    }
  },

  updateProduct: async (productId, data) => {
    try {
      const response = await api.put(`/api/products/${productId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  uploadProductImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/api/products/upload-images', formData, {
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
        error
      };
    }
  }
};

export default productAPI; 