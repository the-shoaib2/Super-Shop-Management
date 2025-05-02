import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeAPI } from '@/services/api';
import { toast } from 'react-hot-toast';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [currentStore, setCurrentStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Fetch stores data
  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getOwnerStores();
      
      if (response.success && response.data) {
        const validStores = response.data.filter(store => 
          store && store.id && store.name
        );
        
        setStores(validStores);
        
        if (!currentStore && validStores.length > 0) {
          setCurrentStore(validStores[0]);
          await fetchDashboardStats(validStores[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  // Switch to a different store
  const switchStore = async (storeId) => {
    try {
      setLoading(true);
      const response = await storeAPI.switchStore(storeId);
      
      if (response.success) {
        const newStore = stores.find(store => store.id === storeId);
        if (newStore) {
          setCurrentStore(newStore);
          await fetchDashboardStats(storeId);
          toast.success(`Switched to ${newStore.name}`);
          return true;
        }
      } else {
        toast.error(response.error || 'Failed to switch store');
      }
    } catch (error) {
      console.error('Failed to switch store:', error);
      toast.error('Failed to switch store');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Fetch dashboard stats for a store
  const fetchDashboardStats = async (storeId) => {
    if (!storeId) return;

    try {
      const response = await storeAPI.getDashboardStats(storeId);
      if (response.success && response.data) {
        setStats({
          totalSales: response.data.totalSales || 0,
          totalOrders: response.data.totalOrders || 0,
          totalProducts: response.data.totalProducts || 0,
          totalCustomers: response.data.totalCustomers || 0
        });
      } else {
        console.error('Failed to fetch dashboard stats:', response.error);
        toast.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to fetch dashboard stats');
    }
  };

  // Create a new store
  const createStore = async (storeData) => {
    try {
      setLoading(true);
      const response = await storeAPI.createStore(storeData);
      if (response.success) {
        const newStore = response.data;
        setStores(prev => [...prev, newStore]);
        setCurrentStore(newStore);
        await fetchDashboardStats(newStore.id);
        toast.success('Store created successfully');
        return newStore;
      }
    } catch (error) {
      console.error('Failed to create store:', error);
      toast.error('Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  // Update store details
  const updateStore = async (storeId, data) => {
    try {
      setLoading(true);
      const response = await storeAPI.updateStore(storeId, data);
      if (response.success) {
        setStores(prev => 
          prev.map(store => 
            store.id === storeId ? { ...store, ...data } : store
          )
        );
        if (currentStore?.id === storeId) {
          setCurrentStore(prev => ({ ...prev, ...data }));
          await fetchDashboardStats(storeId);
        }
        toast.success('Store updated successfully');
      }
    } catch (error) {
      console.error('Failed to update store:', error);
      toast.error('Failed to update store');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentStore,
    stores,
    loading,
    stats,
    switchStore,
    createStore,
    updateStore,
    fetchDashboardStats,
    fetchStores
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
} 