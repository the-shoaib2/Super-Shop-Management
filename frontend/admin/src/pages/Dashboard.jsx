import { useEffect, useState } from "react";
import { dashboardAPI, storeAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";

export default function Dashboard() {
  const { user } = useAuth();
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [ownerStores, setOwnerStores] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOwnerData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOwnerData = async () => {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch owner's stores
      const storesResponse = await storeAPI.getOwnerStores();
      console.log('Stores response:', storesResponse);

      if (storesResponse?.success) {
        setOwnerStores(storesResponse.data);
        
        // If there are stores, try to get the current store
        if (storesResponse.data.length > 0) {
          try {
            const currentStoreResponse = await storeAPI.getCurrentStore();
            if (currentStoreResponse?.success) {
              setCurrentStore(currentStoreResponse.data);
              await fetchDashboardStats(currentStoreResponse.data.id);
            }
          } catch (error) {
            // If current store fails, use the first store from the list
            console.log('Using first store as current store');
            setCurrentStore(storesResponse.data[0]);
            await fetchDashboardStats(storesResponse.data[0].id);
          }
        } else {
          setShowStoreDialog(true);
        }
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
      toast.error('Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async (storeId) => {
    try {
      if (!storeId) {
        console.warn('No store ID provided for fetching stats');
        return;
      }

      const response = await dashboardAPI.getStats(storeId);
      if (response?.data?.success) {
        setStats(response.data.data);
      } else {
        console.warn('No stats data received:', response);
        setStats({
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
      });
    }
  };

  const handleStoreCreated = async (newStore) => {
    setCurrentStore(newStore);
    setOwnerStores(prev => [...prev, newStore]);
    await fetchDashboardStats(newStore.id);
    toast.success('Store created and selected');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {currentStore ? (
        <>
          <h1 className="text-2xl font-bold mb-6">
            {currentStore.name} Dashboard
          </h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">Total Sales</h2>
              <p className="text-2xl font-bold">
                ${(stats.totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">Total Orders</h2>
              <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">Total Products</h2>
              <p className="text-2xl font-bold">{stats.totalProducts || 0}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h2 className="font-semibold">Total Customers</h2>
              <p className="text-2xl font-bold">{stats.totalCustomers || 0}</p>
            </div>
          </div>
        </>
      ) : (
        <CreateStoreDialog 
          open={showStoreDialog} 
          onClose={() => setShowStoreDialog(false)}
          onStoreCreated={handleStoreCreated}
        />
      )}
    </div>
  );
}
