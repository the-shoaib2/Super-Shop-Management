import { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";

export default function Dashboard() {
  const { store, setStore } = useAuth();
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store) {
      setShowStoreDialog(true);
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard statistics");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [store]);

  if (loading && store) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!store) {
    return (
      <CreateStoreDialog 
        open={showStoreDialog} 
        onClose={() => setShowStoreDialog(false)}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold">
            ${stats.totalSales.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold">Total Customers</h2>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
      </div>
    </div>
  );
} 