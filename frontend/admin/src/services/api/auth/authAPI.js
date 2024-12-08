import api from '../../config/config';

export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Login request data:', {
        email: credentials.email,
        password: '********' // Don't log actual password
      });

      const response = await api.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('Login response:', {
        ...response.data,
        data: response.data?.data ? {
          ...response.data.data,
          token: '********' // Don't log actual token
        } : null
      });

      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        if (response.data.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      throw {
        message: error.response?.data?.message || error.message,
        validationErrors: error.response?.data?.data,
        status: error.response?.status
      };
    }
  },

  register: async (userData) => {
    try {
      console.log('Registration request data:', userData);

      const response = await api.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        description: userData.description || ''
      });

      console.log('Registration response:', response.data);

      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      throw {
        message: error.response?.data?.message || error.message,
        validationErrors: error.response?.data?.data,
        status: error.response?.status
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/accounts/me');
      return response.data;
    } catch (error) {
      console.error('Auth check failed:', error.response?.data || error);
      throw error;
    }
  }
};

export default authAPI; 