import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedStore = localStorage.getItem('store')
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      if (storedStore) {
        setStore(JSON.parse(storedStore))
      }
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/')
      }
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login')
      }
    }
    setLoading(false)
  }, [navigate, location.pathname])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('store')
    setUser(null)
    setStore(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, store, setStore, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 