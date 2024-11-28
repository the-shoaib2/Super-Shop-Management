import api from '../config';

export const dashboardAPI = {
  getStats: async (storeId) => {
    try {
      const response = await api.get(`/api/dashboard/stats/${storeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get stats'
      };
    }
  },

  getSalesReport: async (startDate, endDate) => {
    try {
      // Format dates to match backend expectations
      const params = {
        startDate: new Date(startDate).toISOString().split('T')[0],
        endDate: new Date(endDate).toISOString().split('T')[0]
      };

      const response = await api.get('/api/dashboard/sales', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get sales report error:', error);
      return {
        success: false,
        data: {
          salesData: [],
          orderStats: [],
          productStats: [],
          categoryStats: []
        }
      };
    }
  }
};

export default dashboardAPI; 