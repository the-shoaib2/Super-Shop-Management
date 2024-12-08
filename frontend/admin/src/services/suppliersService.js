import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const suppliersService = {
  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/suppliers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },
  
  createSupplier: async (supplierData) => {
    try {
      const response = await axios.post(`${BASE_URL}/suppliers`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  updateSupplier: async (supplierId, supplierData) => {
    try {
      const response = await axios.put(`${BASE_URL}/suppliers/${supplierId}`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  }
};
