const getToken = () => {
  return localStorage.getItem('token') || '';
};

export const uploadImage = async (file, folder = '') => {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files, folder = '') => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/upload/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload images');
    }

    return response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export * from './api/index';