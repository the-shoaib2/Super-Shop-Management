import api from './api/config'

export const storeAPI = {
  // ... existing methods ...

  getStoreBillboards: async (storeId) => {
    try {
      const response = await api.get(`/api/stores/${storeId}/billboards`)
      return response.data
    } catch (error) {
      console.error('Get billboards error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch billboards',
        error
      }
    }
  },

  createStoreBillboard: async (storeId, formData) => {
    try {
      const response = await api.post(
        `/api/stores/${storeId}/billboards`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Create billboard error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create billboard',
        error
      }
    }
  },

  updateStoreBillboard: async (storeId, billboardId, formData) => {
    try {
      const response = await api.put(
        `/api/stores/${storeId}/billboards/${billboardId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Update billboard error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update billboard',
        error
      }
    }
  },

  deleteStoreBillboard: async (storeId, billboardId) => {
    try {
      const response = await api.delete(`/api/stores/${storeId}/billboards/${billboardId}`)
      return response.data
    } catch (error) {
      console.error('Delete billboard error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete billboard',
        error
      }
    }
  }
} 