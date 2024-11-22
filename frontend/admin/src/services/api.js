import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      
      if (response.data?.success && response.data?.data?.token) {
        const { token, ...user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
      
      return response.data
    } catch (error) {
      console.error('Registration Error:', error)
      throw error
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      console.log('Server response:', response.data)
      const data = response.data?.data || response.data

      if (!data) {
        throw new Error('No data received from server')
      }

      const token = data.token || data.accessToken
      const user = data.user || data

      if (!token) {
        throw new Error('No token received from server')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { user, token }
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      // Try to get the stored user first
      const storedUser = localStorage.getItem('user')
      
      try {
        // Try to validate token with backend
        const response = await api.get('/api/auth/check-token') // or whatever your actual endpoint is
        return {
          success: true,
          data: {
            user: response.data?.user || JSON.parse(storedUser)
          }
        }
      } catch (error) {
        // If backend validation fails but we have stored user data
        if (storedUser) {
          return {
            success: true,
            data: {
              user: JSON.parse(storedUser)
            }
          }
        }
        throw error
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('currentStoreId')
    }
  }
}

// Product APIs
export const productAPI = {
  getAllProducts: () => api.get('/api/products'),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (product) => api.post('/api/products', product),
  updateProduct: (id, product) => api.put(`/api/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  searchProducts: (query) => api.get(`/api/products/search?q=${query}`),
  getProductCategories: () => api.get('/api/products/categories'),
}

// Order APIs
export const orderAPI = {
  getAllOrders: () => api.get('/api/orders'),
  getOrder: (id) => api.get(`/api/orders/${id}`),
  createOrder: (order) => api.post('/api/orders', order),
  updateOrderStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/api/orders/${id}`),
  getOrdersByStatus: (status) => api.get(`/api/orders/status/${status}`),
}

// Customer APIs
export const customerAPI = {
  getAllCustomers: () => api.get('/api/customers'),
  getCustomer: (id) => api.get(`/api/customers/${id}`),
  createCustomer: (customer) => api.post('/api/customers', customer),
  updateCustomer: (id, customer) => api.put(`/api/customers/${id}`, customer),
  deleteCustomer: (id) => api.delete(`/api/customers/${id}`),
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: (storeId) => api.get(`/api/dashboard/stats/${storeId}`),
  getSalesReport: (startDate, endDate) => 
    api.get(`/api/dashboard/sales?start=${startDate}&end=${endDate}`),
  getTopProducts: () => api.get('/api/dashboard/top-products'),
  getRecentOrders: () => api.get('/api/dashboard/recent-orders'),
}

// Category APIs
export const categoryAPI = {
  getAllCategories: () => api.get('/api/categories'),
  getCategory: (id) => api.get(`/api/categories/${id}`),
  createCategory: (category) => api.post('/api/categories', category),
  updateCategory: (id, category) => api.put(`/api/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
}

// Inventory APIs
export const inventoryAPI = {
  getInventoryLevels: () => api.get('/api/inventory'),
  updateStock: (productId, quantity) => 
    api.patch(`/api/inventory/${productId}`, { quantity }),
  getLowStockAlerts: () => api.get('/api/inventory/low-stock'),
}

// Report APIs
export const reportAPI = {
  getSalesReport: (params) => api.get('/api/reports/sales', { params }),
  getInventoryReport: () => api.get('/api/reports/inventory'),
  getCustomerReport: () => api.get('/api/reports/customers'),
  exportReport: (type, params) => api.get(`/api/reports/export/${type}`, { 
    params,
    responseType: 'blob'
  }),
}

// Error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    })

    if (error.response?.status === 500) {
      error.message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Internal server error'
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('currentStoreId')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 