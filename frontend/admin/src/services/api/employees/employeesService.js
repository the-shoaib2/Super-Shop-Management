import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const employeesService = {
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${BASE_URL}/employees`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axios.put(`${BASE_URL}/employees/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }
};
