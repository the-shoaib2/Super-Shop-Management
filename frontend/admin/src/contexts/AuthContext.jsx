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
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser && storedUser !== 'undefined') {
          try {
            setUser(JSON.parse(storedUser))
          } catch (parseError) {
            console.error('Failed to parse stored user:', parseError)
            localStorage.removeItem('user')
          }
        } else {
          // Only check auth if no stored user
          const response = await authAPI.checkAuth()
          if (response?.data) {
            setUser(response.data)
            localStorage.setItem('user', JSON.stringify(response.data))
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('user')
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate, location.pathname])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      console.log('Login response:', response) // Debug log
      
      // Check if response exists
      if (!response) {
        throw new Error('No response received')
      }

      // Get data from response
      const data = response.data || response
      
      // Check if we have the necessary data
      if (!data.token && !data.email) {
        console.error('Invalid response structure:', data)
        throw new Error('Invalid response structure')
      }
      
      // Store token if present
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      // Create user data object
      const userData = {
        email: data.email,
        fullName: data.fullName || null,
        storeName: data.storeName || null,
        // Add any other relevant fields
      }
      
      // Update state and storage
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(error.message || 'Login failed')
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
    setStores,
    setCurrentStore
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