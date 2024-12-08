// Centralized Services Export

// Core API Configuration
export { default as api } from './config/config';
export { 
  createAPIClient, 
  getToken, 
  setToken, 
  APIError, 
  uploadImage, 
  uploadMultipleImages 
} from './utils/api';

// Authentication Services
export { default as authAPI } from './api/auth/authAPI';
export { setAuthToken, getAuthToken } from './api/index';

// Account Services
export { default as accountAPI } from './api/account/accountAPI';

// Store Management
export { storeAPI } from './api/store/storeAPI';
export { orderAPI } from './api/store/orderAPI';
export { productAPI } from './api/store/productAPI';

// Dashboard and Reporting
export { dashboardAPI } from './api/dashboard/dashboardAPI';
export { reportsService } from './api/reports/reportsService';
export { suppliersService } from './api/suppliers/suppliersService';

// Cloudinary Integration
export { default as cloudinaryAPI } from './api/cloudinary/cloudinaryAPI';
