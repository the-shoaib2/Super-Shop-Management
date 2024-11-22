import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '@/services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (!token || !storedUser) {
          setUser(null)
          setLoading(false)
          if (!isPublicRoute(location.pathname)) {
            navigate('/login', { replace: true })
          }
          return
        }

        try {
          // Set initial user state from localStorage
          setUser(JSON.parse(storedUser))
          
          // Validate token in background
          const response = await authAPI.checkAuth()
          if (response.success) {
            setUser(response.data.user)
          }
        } catch (error) {
          console.error('Auth validation failed:', error)
          // Only clear auth if it's a 401 error
          if (error.response?.status === 401) {
            setUser(null)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (!isPublicRoute(location.pathname)) {
              navigate('/login', { replace: true })
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }

    // Helper function to check if route is public
    const isPublicRoute = (path) => {
      return ['/login', '/signup', '/'].includes(path)
    }

    checkAuth()
  }, [navigate, location.pathname])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      
      setUser(response.user)
      return true

    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed'
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 