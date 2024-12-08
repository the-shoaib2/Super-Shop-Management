import api from '../../config/config';

export const orderAPI = {
  getOrders: async (storeId, params = {}) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/orders`, { params });
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId, reason) => {
    try {
      const response = await api.post(`/api/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }
};

export default orderAPI; 