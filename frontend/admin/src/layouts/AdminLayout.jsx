import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { FiLogOut } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import StoreSwitcher from '@/components/StoreSwitcher'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Supershop Admin</h1>
        </div>
        <div className="p-4">
          <StoreSwitcher />
        </div>
        <nav className="flex flex-col justify-between h-[calc(100%-8rem)]">
          <div className="space-y-1 p-4">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start  mb-2">
                Dashboard
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="w-full justify-start  mb-2">
                Products
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="ghost" className="w-full justify-start  mb-2">
                Orders
              </Button>
            </Link>
          </div>
          
          {/* Logout button at bottom */}
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </aside>
      <main className="ml-64 p-6">
        <Outlet />
      </main>
    </div>
  )
} 