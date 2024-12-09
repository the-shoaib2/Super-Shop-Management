import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const productService = {
  // Fetch all active products
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`, {
        params: {
          isActive: true,
          isArchived: false
        }
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Fetch featured products
  getFeaturedProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`, {
        params: {
          isFeatured: true,
          isActive: true,
          isArchived: false
        }
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch featured products');
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get product details by ID
  getProductById: async (productId) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch product details');
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/search`, { 
        params: { 
          query,
          isActive: true,
          isArchived: false
        } 
      });
      return response.data;
    } catch (error) {
      toast.error('Product search failed');
      console.error('Error searching products:', error);
      throw error;
    }
  }
};
