import api from '../../config/config';

export const accountAPI = {
  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/accounts/me');
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get profile',
        data: null
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('Sending profile data:', profileData);
      const response = await api.put('/api/accounts/me', profileData);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
        data: null
      };
    }
  },

  //Upload Avatar
  uploadAvatar: async (formData, folder = 'accounts') => {
    try {
      // Add proper headers for multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        params: {
          folder: folder
        }
      };

      const response = await api.post('/api/upload/image', formData, config);
      
      // Adjust response handling based on your API response structure
      if (response.data) {
        return {
          success: true,
          data: {
            success: true,
            // Adjust these based on your API response structure
            url: response.data.avatarUrl || response.data.url || response.data.data?.url,
          }
        };
      }
      
      return {
        success: false,
        error: 'Invalid response from server',
        data: null
      };
      
    } catch (error) {
      console.error('Upload avatar error:', error);
      // Log the detailed error response for debugging
      if (error.response) {
        console.log('Error response data:', error.response.data);
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload avatar',
        data: null
      };
    }
  },

  // Settings
  getSettings: async () => {
    try {
      const response = await api.get('/api/account/settings');
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Get settings error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get settings',
        data: null
      };
    }
  },

  // Appearance Settings
  updateAppearanceSettings: async (settings) => {
    try {
      const response = await api.put('/api/account/settings/appearance', settings);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Update appearance settings error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update appearance settings',
        data: null
      };
    }
  },

  // Language Settings
  updateLanguageSettings: async (settings) => {
    try {
      const response = await api.put('/api/account/settings/language', settings);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Update language settings error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update language settings',
        data: null
      };
    }
  },

  // Notification Settings
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/api/account/settings/notifications', settings);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Update notification settings error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update notification settings',
        data: null
      };
    }
  }
};

export default accountAPI; 