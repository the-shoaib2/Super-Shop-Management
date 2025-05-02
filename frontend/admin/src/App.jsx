import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/auth-context'
import { StoreProvider } from './contexts/store-context'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PageHeader } from '@/components/page-header'
import LoadingScreen from './components/loading-screen'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/main/Dashboard/page'))
const Store = lazy(() => import('./pages/main/Store/page'))
const Orders = lazy(() => import('./pages/main/Orders/page'))
const Sales = lazy(() => import('./pages/management/Sales/page'))
const Employees = lazy(() => import('./pages/management/Employees/page'))
const Customers = lazy(() => import('./pages/management/Customers/page'))
const Suppliers = lazy(() => import('./pages/management/Suppliers/page'))
const Finance = lazy(() => import('./pages/management/Finance/page'))
const Reports = lazy(() => import('./pages/additional/Reports/page'))
const AccountSettings = lazy(() => import('./pages/additional/AccountSettings/page'))
const Login = lazy(() => import('./pages/auth/login/page'))
const Signup = lazy(() => import('./pages/auth/register/page'))
const APIs = lazy(() => import('./pages/additional/APIs/page'))

// Configure future flags
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function App() {
  return (
    <Router {...routerOptions}>
      <AuthProvider>
        <StoreProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="dashboard/*" element={<Dashboard />} />
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="store/*" element={<Store />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="sales" element={<Sales />} />
                      <Route path="employees" element={<Employees />} />
                      <Route path="customers" element={<Customers />} />
                      <Route path="suppliers" element={<Suppliers />} />
                      <Route path="finance" element={<Finance />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="store-apis" element={<APIs />} />
                      <Route path="account-settings" element={<AccountSettings />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </StoreProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
