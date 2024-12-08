import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reportsService = {
  generateSalesReport: async (filters) => {
    try {
      const response = await axios.get(`${BASE_URL}/reports/sales`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error generating sales report:', error);
      throw error;
    }
  },
  
  generateInventoryReport: async (filters) => {
    try {
      const response = await axios.get(`${BASE_URL}/reports/inventory`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error generating inventory report:', error);
      throw error;
    }
  },

  generateProfitabilityReport: async (period) => {
    try {
      const response = await axios.get(`${BASE_URL}/reports/profitability`, { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error generating profitability report:', error);
      throw error;
    }
  }
};
