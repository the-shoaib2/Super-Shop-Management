import api from '../config/config';
import { authAPI } from './auth/authAPI';
import { accountAPI } from './account/accountAPI';
import { storeAPI } from './store/storeAPI';
import { orderAPI } from './store/orderAPI';
import { productAPI } from './store/productAPI';
import { dashboardAPI } from './dashboard/dashboardAPI';
import { employeesService } from './employees/employeesService';
import { financeService } from './finance/financeService';
import { reportsService } from './reports/reportsService';
import { salesService } from './sales/salesService';
import { suppliersService } from './suppliers/suppliersService';
import cloudinaryAPI from './cloudinary/cloudinaryAPI';

// Auth helpers
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => localStorage.getItem('token');

// Export all APIs
export {
  api,
  authAPI,
  accountAPI,
  storeAPI,
  orderAPI,
  productAPI,
  dashboardAPI,
  employeesService,
  financeService,
  reportsService,
  salesService,
  suppliersService,
  cloudinaryAPI
};