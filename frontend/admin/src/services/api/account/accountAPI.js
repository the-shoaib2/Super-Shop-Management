import api from '../config';

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