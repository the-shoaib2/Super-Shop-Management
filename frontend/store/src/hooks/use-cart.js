import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (data) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);
        
        if (existingItem) {
          toast.error('Item already in cart');
          return;
        }

        set({ items: [...get().items, data] });
        toast.success('Item added to cart');
      },
      removeItem: (id) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success('Item removed from cart');
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
