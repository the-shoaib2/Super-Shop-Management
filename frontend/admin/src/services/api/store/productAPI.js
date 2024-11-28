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
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
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
  }
};

export default productAPI; 