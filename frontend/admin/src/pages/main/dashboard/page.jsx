import { useEffect, useState } from "react";
import { dashboardAPI, storeAPI } from "@/services";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import CreateStoreDialog from "@/components/dialogs/CreateStoreDialog";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Bar as ChartBar,
  BarChart as ChartBarChart,
  CartesianGrid as ChartCartesianGrid,
  XAxis as ChartXAxis,
  YAxis as ChartYAxis,
} from "recharts"
import { StoreCardDialog } from '../../../components/dialogs/StoreCardDialog'
import { StoreSettingsDialog } from '../../../components/dialogs/StoreSettingsDialog'
import { 
  DEMO_SALES_DATA, 
  DEMO_CATEGORY_STATS, 
  DEMO_PRODUCT_STATS, 
  DEMO_SALES_TREND_DATA,
  DEMO_STATS
} from "@/constants/dashboardData"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4560', '#775DD0']

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [ownerStores, setOwnerStores] = useState([]);
  const [stats, setStats] = useState(DEMO_STATS);
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState(DEMO_SALES_DATA);
  const [productStats, setProductStats] = useState(DEMO_PRODUCT_STATS);
  const [orderStats, setOrderStats] = useState(DEMO_SALES_TREND_DATA);
  const [categoryStats, setCategoryStats] = useState(DEMO_CATEGORY_STATS);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
      if (response?.success) {
        setStats(response.data?.data || {
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0
        });
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (currentStore?.id) {
      fetchDashboardData()
    }
  }, [currentStore])

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, salesResponse] = await Promise.all([
        dashboardAPI.getStats(currentStore.id),
        dashboardAPI.getSalesReport(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        )
      ]);

      if (statsResponse?.success) {
        setStats(statsResponse.data?.data || {
          totalSales: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0
        });
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handleCopyStoreId = () => {
    if (currentStore?.storeId) {
      navigator.clipboard.writeText(currentStore.storeId)
      // Optionally show a toast notification
      toast.success('Store ID copied to clipboard')
    }
  }

  const handleStoreSwitch = async (storeId) => {
    try {
      const response = await storeAPI.switchStore(storeId)
      if (response.success) {
        setCurrentStore(response.data)
        await fetchDashboardStats(response.data.id)
        toast.success(`Switched to ${response.data.name}`)
      } else {
        toast.error(response.error || 'Failed to switch store')
      }
    } catch (error) {
      console.error('Store switch error:', error)
      toast.error('Failed to switch store')
    }
  }

  const handleStoreUpdate = async (updatedStore) => {
    setCurrentStore(prev => ({
      ...prev,
      ...updatedStore
    }))
    await fetchDashboardStats(updatedStore.id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Store Information Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Left Section - Store Info */}
            <div className="flex items-center space-x-4">
              {/* Store Icon and Name */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {(currentStore?.name && currentStore?.name.length > 0) ? currentStore.name : 'No Store Selected'}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      {currentStore?.description || 'No description available'}
                    </p>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {currentStore?.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Store ID Section */}
              <div className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-3 py-1.5">
                <span className="text-sm text-muted-foreground">ID:</span>
                <code className="text-sm font-mono text-primary">
                  {currentStore?.storeId || 'N/A'}
                </code>
                <button
                  onClick={handleCopyStoreId}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                  title="Copy Store ID"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>

              {/* Store Status */}
              <div className="flex items-center space-x-2 bg-secondary/20 rounded-lg px-3 py-1.5">
                <span className={`h-2 w-2 rounded-full ${
                  currentStore?.active ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {currentStore?.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center space-x-2">
                {/* QR Code Button */}
                <button
                  onClick={() => setIsQRDialogOpen(true)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Show QR Code"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" 
                    />
                  </svg>
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Store Settings"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
  
          <h3 className="text-gray-500 text-sm">Total Sales</h3>
          <p className="text-2xl font-bold">${stats.totalSales?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders || '0'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts || '0'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Customers</h3>
          <p className="text-2xl font-bold">{stats.totalCustomers || '0'}</p>
        </div>

      </div>

      {/* Revenue Trend - Area Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <ChartCartesianGrid strokeDasharray="3 3" />
              <ChartXAxis dataKey="date" />
              <ChartYAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status - Donut Chart */}
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products - Horizontal Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartBarChart
                data={productStats}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <ChartCartesianGrid strokeDasharray="3 3" />
                <ChartXAxis type="number" />
                <ChartYAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <ChartBar dataKey="sales" fill="#82ca9d">
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </ChartBar>
              </ChartBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance - Radial Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Category Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius={30} 
                outerRadius={120} 
                data={categoryStats.map(stat => ({
                  name: stat.name || stat.category || 'Unknown',
                  value: Math.max(0, Number(stat.value || stat.netProfit || 0)),
                  fill: stat.fill || COLORS[0]
                }))}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Sales Comparison - Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Sales Comparison</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <ChartCartesianGrid strokeDasharray="3 3" />
                <ChartXAxis dataKey="date" />
                <ChartYAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="lastPeriod" 
                  stroke="#82ca9d" 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

{/* Sales Trend - Bar Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
              quantity: {
                label: "Quantity",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ChartBarChart data={DEMO_SALES_DATA}>
              <ChartCartesianGrid strokeDasharray="3 3" />
              <ChartXAxis dataKey="category" />
              <ChartYAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartBar dataKey="totalSales" name="Sales" />
              <ChartBar dataKey="quantitySold" name="Quantity" />
            </ChartBarChart>
          </ChartContainer>
        </div>
{/* Profitability - Bar Chart */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Profitability</h2>
          <ChartContainer
            config={{
              profit: {
                label: "Profit",
                color: "hsl(var(--chart-3))",
              },
              margin: {
                label: "Margin %",
                color: "hsl(var(--chart-4))",
              },
            }}
          >
            <ChartBarChart data={DEMO_CATEGORY_STATS}>
              <ChartCartesianGrid strokeDasharray="3 3" />
              <ChartXAxis dataKey="category" />
              <ChartYAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartBar dataKey="netProfit" name="Profit" />
              <ChartBar dataKey="profitMargin" name="Margin %" />
            </ChartBarChart>
          </ChartContainer>
        </div>
      </div>


      QR Code Dialog
      <StoreCardDialog 
        isOpen={isQRDialogOpen}
        onClose={() => setIsQRDialogOpen(false)}
        store={currentStore}
      />

      <StoreSettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        store={currentStore}
        onUpdate={handleStoreUpdate}
      />
    </div>
  );
}
