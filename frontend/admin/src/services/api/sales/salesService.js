import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const salesService = {
  getAllSales: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sales`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },
  
  createSale: async (saleData) => {
    try {
      const response = await axios.post(`${BASE_URL}/sales`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  updateSale: async (saleId, saleData) => {
    try {
      const response = await axios.put(`${BASE_URL}/sales/${saleId}`, saleData);
      return response.data;
    } catch (error) {
      console.error('Error updating sale:', error);
      throw error;
    }
  }
};
