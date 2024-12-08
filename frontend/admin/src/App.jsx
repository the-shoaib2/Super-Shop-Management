import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/main/Dashboard/page'
import Store from './pages/main/Store/page'
import Orders from './pages/main/Orders/page'
import Sales from './pages/management/Sales/page'
import Employees from './pages/management/Employees/page'
import Customers from './pages/management/Customers/page'
import Suppliers from './pages/management/Suppliers/page'
import Finance from './pages/management/Finance/page'
import Reports from './pages/additional/Reports/page'
import AccountSettings from './pages/additional/AccountSettings/page'
import Login from './pages/auth/login/page'
import Signup from './pages/auth/signup/page'
import APIs from './pages/additional/APIs/page'
import { ShoppingCart } from 'lucide-react'
import LoadingScreen from './components/LoadingScreen'

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

function App() {
  return (
    <Router {...routerOptions}>
      <AuthProvider>
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
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
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
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  )
}

export default App
