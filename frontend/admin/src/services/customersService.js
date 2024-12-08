import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customersService = {
  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  createCustomer: async (customerData) => {
    try {
      const response = await axios.post(`${BASE_URL}/customers`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await axios.put(`${BASE_URL}/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
};
