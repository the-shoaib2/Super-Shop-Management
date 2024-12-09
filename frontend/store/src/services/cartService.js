import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cartService = {
  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(`${BASE_URL}/cart/items`, { 
        productId, 
        quantity 
      });
      toast.success('Product added to cart');
      return response.data;
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Get current cart items
  getCartItems: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cart/items`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch cart items');
      console.error('Error fetching cart items:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (cartItemId, quantity) => {
    try {
      const response = await axios.patch(`${BASE_URL}/cart/items/${cartItemId}`, { 
        quantity 
      });
      toast.success('Cart updated');
      return response.data;
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/items/${cartItemId}`);
      toast.success('Item removed from cart');
      return response.data;
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/items`);
      toast.success('Cart cleared');
      return response.data;
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
