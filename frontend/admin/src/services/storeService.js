import api from './api'

class StoreService {
  // Get store settings
  async getStoreSettings(storeId) {
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
        error: error.response?.data?.message || 'Failed to get store settings'
      }
    }
  }

  // Update store settings
  async updateStore(storeId, settings) {
    try {
      const response = await api.put(`/api/stores/${storeId}`, settings)
      return {
        success: true,
        data: response.data?.data
      }
    } catch (error) {
      console.error('Update store error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update store'
      }
    }
  }

  // Delete store
  async deleteStore(storeId) {
    try {
      const response = await api.delete(`/api/stores/${storeId}`)
      return {
        success: true,
        message: response.data?.message || 'Store deleted successfully'
      }
    } catch (error) {
      console.error('Delete store error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete store'
      }
    }
  }

  // Switch store
  async switchStore(storeId) {
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
  }
}

export const storeService = new StoreService()
export default storeService 