import { useEffect, useState, Suspense, lazy } from "react";
import { dashboardAPI, storeAPI } from "@/services";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useStore } from "@/contexts/store-context";
import { Skeleton } from "@/components/ui/skeleton";
import StoreInfoCard from '@/components/store-info-card';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

import {
  DEMO_SALES_DATA,
  DEMO_CATEGORY_STATS,
  DEMO_PRODUCT_STATS,
  DEMO_SALES_TREND_DATA,
  DEMO_STATS
} from "@/constants/dashboard-data"

// Lazy load dashboard pages
const StoreOverview = lazy(() => import('./overview/page'));
const StoreAnalytics = lazy(() => import('./analytics/page'));
const StoreReports = lazy(() => import('./reports/page'));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0']

// Loading skeleton for dashboard pages
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}

// Main Dashboard Component with Routing
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [salesData, setSalesData] = useState(DEMO_SALES_DATA);
  const [productStats, setProductStats] = useState(DEMO_PRODUCT_STATS);
  const [orderStats, setOrderStats] = useState(DEMO_SALES_TREND_DATA);
  const [categoryStats, setCategoryStats] = useState(DEMO_CATEGORY_STATS);

  const { 
    currentStore, 
    loading: storeContextLoading, 
    stats,
    fetchDashboardStats 
  } = useStore();

  useEffect(() => {
    if (currentStore?.id) {
      fetchDashboardData();
    }
  }, [currentStore?.id]);

  const fetchDashboardData = async () => {
    try {
      if (!currentStore?.id) return;

      const [salesResponse] = await Promise.all([
        dashboardAPI.getSalesReport(
          currentStore.id,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        )
      ]);

      if (salesResponse?.success) {
        // Ensure sales data has valid numeric values
        const validatedSalesData = (salesResponse.data?.salesData || []).map(item => ({
          ...item,
          amount: Number(item.amount) || 0,
          date: item.date || new Date().toISOString()
        }));

        // Ensure order stats have valid numeric values
        const validatedOrderStats = (salesResponse.data?.orderStats || []).map(item => ({
          ...item,
          value: Number(item.value) || 0
        }));

        // Ensure product stats have valid numeric values
        const validatedProductStats = (salesResponse.data?.productStats || []).map(item => ({
          ...item,
          value: Number(item.value) || 0
        }));

        // Ensure category stats have valid numeric values and proper structure
        const validatedCategoryStats = (salesResponse.data?.categoryStats || []).map(item => ({
          name: item.name || 'Unknown',
          value: Math.max(0, Number(item.value) || 0), // Ensure value is non-negative
          fill: item.fill || COLORS[0] // Provide a default color if none specified
        }));

        setSalesData(validatedSalesData);
        setOrderStats(validatedOrderStats);
        setProductStats(validatedProductStats);
        setCategoryStats(validatedCategoryStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  const handleCopyStoreId = () => {
    if (currentStore?.storeId) {
      navigator.clipboard.writeText(currentStore.storeId)
      toast.success('Store ID copied to clipboard')
    }
  }

  if (storeContextLoading) {
    return (
      <div className="flex p-4 gap-4 flex-col h-full">
        <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex p-4 gap-4 flex-col h-full">
      <StoreInfoCard 
        currentStore={currentStore}
        onCopyStoreId={handleCopyStoreId}
        onShowQRCode={() => setIsQRDialogOpen(true)}
        onShowSettings={() => setIsSettingsOpen(true)}
      />

      <Suspense fallback={<DashboardSkeleton />}>
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<StoreOverview 
            stats={stats}
            salesData={salesData}
            orderStats={orderStats}
            productStats={productStats}
            categoryStats={categoryStats}
          />} />
          <Route path="analytics" element={<StoreAnalytics 
            stats={stats}
            salesData={salesData}
            orderStats={orderStats}
            productStats={productStats}
            categoryStats={categoryStats}
          />} />
          <Route path="reports" element={<StoreReports 
            stats={stats}
            salesData={salesData}
            orderStats={orderStats}
            productStats={productStats}
            categoryStats={categoryStats}
          />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
