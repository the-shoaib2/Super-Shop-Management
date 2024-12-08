import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const financeService = {
  getFinancialOverview: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/finance/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      throw error;
    }
  },
  
  getIncomeStatement: async (period) => {
    try {
      const response = await axios.get(`${BASE_URL}/finance/income-statement`, { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching income statement:', error);
      throw error;
    }
  },

  getBalanceSheet: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/finance/balance-sheet`);
      return response.data;
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  }
};
