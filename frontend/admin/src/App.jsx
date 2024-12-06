import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Store from './pages/Store'
import Orders from './pages/Orders'
import AccountSettings from './pages/AccountSettings'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import APIs from './pages/APIs'
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
            <Route path="cart" element={<ShoppingCart />} />
            <Route path="apis" element={<APIs />} />
            <Route path="account-settings" element={<AccountSettings />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  )
}

export default App
