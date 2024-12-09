import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const homeService = {
  // Fetch homepage data
  getHomePageData: async () => {
    try {
      const [featuredProducts, categories] = await Promise.all([
        axios.get(`${BASE_URL}/products`, {
          params: {
            isFeatured: true,
            isActive: true,
            isArchived: false,
            limit: 6
          }
        }),
        axios.get(`${BASE_URL}/categories`)
      ]);

      return {
        featuredProducts: featuredProducts.data,
        categories: categories.data
      };
    } catch (error) {
      toast.error('Failed to load homepage data');
      console.error('Error fetching homepage data:', error);
      throw error;
    }
  },

  // Fetch categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch promotional banners
  getPromotionalBanners: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/banners`, {
        params: {
          isActive: true
        }
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch promotional banners');
      console.error('Error fetching promotional banners:', error);
      throw error;
    }
  }
};
