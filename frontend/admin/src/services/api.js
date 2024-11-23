import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const response = await api.post('/api/auth/refresh', { 
          refreshToken 
        })
        
        const { accessToken, refreshToken: newRefreshToken } = response.data
        
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Update request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

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
      const response = await api.post('/api/auth/login', credentials)
    return response
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
        const response = await api.get('/api/auth/check-token')
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

  logout: async (refreshToken) => {
    return api.post('/api/auth/logout', { refreshToken })
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

// Add this function to the existing API functions
export const storeAPI = {
  createStore: async (storeData) => {
    try {
      const response = await api.post('/api/stores', storeData)
      return response.data
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        console.error('Create Store Error:', {
          status: error.response.status,
          data: error.response.data,
          message: error.response.data?.message || 'No message provided'
        })
      } else {
        console.error('Create Store Error:', error.message)
      }
      throw error
    }
  }
}

export default api 