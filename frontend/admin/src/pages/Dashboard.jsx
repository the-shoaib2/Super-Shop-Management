import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";

export default function Dashboard() {
  const { currentStore } = useAuth();
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentStore) {
      setShowStoreDialog(true);
      setLoading(false);
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardAPI.getStats(currentStore.id);
        
        if (response?.data) {
          setStats(response.data);
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error(error.response?.data?.message || "Failed to fetch dashboard statistics");
        setStats({
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [currentStore]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <CreateStoreDialog 
        open={showStoreDialog} 
        onClose={() => setShowStoreDialog(false)}
      />
    );
  }

  return (
    <div>
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
    </div>
  );
}
