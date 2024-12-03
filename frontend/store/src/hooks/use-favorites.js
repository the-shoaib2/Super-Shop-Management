import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavorites = create(
  persist(
    (set) => ({
      items: [],
      addItem: (data) => 
        set((state) => {
          const existingItem = state.items.find((item) => item.id === data.id);
          
          if (existingItem) {
            return state;
          }

          return { items: [...state.items, data] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      removeAll: () => set({ items: [] }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);

export { useFavorites };
