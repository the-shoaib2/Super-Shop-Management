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
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // Only check auth if no stored user
          const response = await authAPI.checkAuth()
          if (response.data.user) {
            setUser(response.data.user)
            localStorage.setItem('user', JSON.stringify(response.data.user))
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
      const userData = response.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('user')
      setUser(null)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 