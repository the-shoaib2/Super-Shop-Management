import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '@/services/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStore, setCurrentStore] = useState(null)
  const [stores, setStores] = useState([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (!token) {
        handleLogout()
        return
      }

      // Try to parse stored user data
      let userData = null
      try {
        userData = storedUser ? JSON.parse(storedUser) : null
      } catch (error) {
        console.warn('Failed to parse stored user data:', error)
        localStorage.removeItem('user')
      }

      // Set initial user state if we have valid stored data
      if (userData) {
        setUser(userData)
      }

      // Validate token with backend
      try {
        const response = await authAPI.checkAuth()
        if (response?.data?.success) {
          setUser(response.data.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.data.user))
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        if (error.response?.status === 401) {
          handleLogout()
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      
      // Check if we have a token
      if (!response?.data?.token) {
        throw new Error('No token received')
      }

      // Save auth data
      localStorage.setItem('token', response.data.token)
      
      // Handle user data
      const userData = response.data.user || {
        email: credentials.email,
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return {
        success: true,
        data: userData
      }
    } catch (error) {
      console.error('Login error in context:', error)
      throw error
    }
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentStore(null)
    setStores([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('currentStore')
    if (!isPublicRoute(location.pathname)) {
      navigate('/login', { replace: true })
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      handleLogout()
    }
  }

  const switchStore = async (store) => {
    try {
      setCurrentStore(store)
      localStorage.setItem('currentStore', JSON.stringify(store))
    } catch (error) {
      console.error('Error switching store:', error)
      toast.error('Failed to switch store')
    }
  }

  // Helper function to check if route is public
  const isPublicRoute = (path) => {
    return ['/login', '/signup', '/'].includes(path)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    currentStore,
    stores,
    switchStore,
    setStores
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 