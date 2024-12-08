import api from '../../config/config';

export const dashboardAPI = {
  getStats: async (storeId) => {
    try {
      const response = await api.get(`/api/store/${storeId}/dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  getSalesReport: async (storeId, startDate, endDate) => {
    try {
      const response = await api.get(`/api/store/${storeId}/dashboard/sales`, {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  }
};

export default dashboardAPI;
