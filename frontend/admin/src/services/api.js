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

// Update request interceptor to use the correct token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('Registration Error:', error)
      throw error
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      
      // Check if response has data
      if (!response.data) {
        throw new Error('No response data received')
      }

      // Log response for debugging
      console.log('Login response:', response.data)

      // Check response structure
      if (!response.data.success && !response.data.token) {
        throw new Error(response.data.message || 'Invalid response format')
      }

      // Store token if present
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login Error:', error.response || error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed'
      )
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await api.get('/api/auth/check-token')
      return response.data
    } catch (error) {
      console.error('Auth check failed:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return response.data
    } catch (error) {
      console.error('Logout Error:', error)
      // Still remove tokens even if API call fails
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
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
  getStoreProducts: async (storeId) => {
    try {
      const response = await api.get(`/api/products/store/${storeId}`)
      return response.data
    } catch (error) {
      console.error('Get store products error:', error)
      throw error
    }
  },
  createProduct: async (productData) => {
    try {
      const response = await api.post('/api/products', productData)
      return response.data
    } catch (error) {
      console.error('Create product error:', error)
      throw error
    }
  },
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, productData)
      return response.data
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  },
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    }
  },
  getProduct: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Get product error:', error)
      throw error
    }
  }
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
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Store APIs
export const storeAPI = {
  // Get all stores for the authenticated owner
  getOwnerStores: async () => {
    try {
      const response = await api.get('/api/stores')  // Changed from /api/stores/owner/stores
      return {
        success: true,
        data: response.data?.data || []
      }
    } catch (error) {
      console.error('Get owner stores error:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to retrieve stores'
      }
    }
  },

  // Create a new store
  createStore: async (storeData) => {
    try {
      const response = await api.post('/api/stores', {
        name: storeData.name,
        type: storeData.category ? [storeData.category] : [],
        description: storeData.description,
        address: storeData.address,
        location: storeData.location,
        phone: storeData.phone,
        email: storeData.email,
        tags: storeData.tags
      })
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Create store error:', error)
      throw error
    }
  },

  // Switch current store
  switchStore: async (storeId) => {
    try {
      const response = await api.post(`/api/stores/owner/stores/${storeId}/switch`)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Switch store error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to switch store'
      }
    }
  },

  // Get current store
  getCurrentStore: async () => {
    try {
      const response = await api.get('/api/stores/owner/current')
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Get current store error:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to get current store'
      }
    }
  },

  // Get store settings
  getStoreSettings: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/settings`)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Get store settings error:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || 'Failed to get store settings'
      }
    }
  },

  // Get store colors
  getStoreColors: async (storeId) => {
    try {
      const response = await api.get(`/api/${storeId}/colors`)
      return {
        success: true,
        data: response.data?.data || []
      }
    } catch (error) {
      console.error('Get store colors error:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get store colors'
      }
    }
  },

  // Get store sizes
  getStoreSizes: async (storeId) => {
    try {
      const response = await api.get(`/api/${storeId}/sizes`)
      return {
        success: true,
        data: response.data?.data || []
      }
    } catch (error) {
      console.error('Get store sizes error:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get store sizes'
      }
    }
  },

  // Get store categories
  getStoreCategories: async (storeId) => {
    try {
      const response = await api.get(`/api/${storeId}/categories`)
      return {
        success: true,
        data: response.data?.data || []
      }
    } catch (error) {
      console.error('Get store categories error:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get store categories'
      }
    }
  },

  // Get store billboards
  getStoreBillboards: async (storeId) => {
    try {
      const response = await api.get(`/api/${storeId}/billboards`)
      return {
        success: true,
        data: response.data?.data || []
      }
    } catch (error) {
      console.error('Get store billboards error:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Failed to get store billboards'
      }
    }
  }
}

export const accountAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/account-settings/me')
      return response.data
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/account-settings/update', profileData)
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await api.post('/api/account-settings/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Upload avatar error:', error)
      throw error
    }
  }
}

export default api 