import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { FiLogOut } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { 
  Menu, 
  PanelLeft, 
  X 
} from 'lucide-react'
import StoreSwitcher from '@/components/StoreSwitcher'
import { SidebarNavButton } from '@/components/layout/SidebarNavButton'
import { 
  MAIN_NAVIGATION, 
  MANAGEMENT_NAVIGATION, 
  ADDITIONAL_NAVIGATION 
} from '@/config/navigation'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const renderNavigationGroup = (navGroup, title) => (
    <div className="mb-4">
      <h3 className="px-4 text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
        {title}
      </h3>
      <div className="space-y-1 px-1">
        {navGroup.map((link) => (
          <SidebarNavButton 
            key={link.path}
            path={link.path}
            label={link.label}
            icon={link.icon}
            className="w-[calc(100%-0.5rem)] mx-auto" // Ensure buttons are centered with slight margin
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-muted-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-muted-foreground" />
        )}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out",
          "md:translate-x-0", // Always visible on medium and larger screens
          isSidebarOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out on mobile
          "overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30"
        )}
      >
        <div className="sticky top-0 bg-card z-10">
          <div className="flex h-16 items-center border-b px-6 justify-between">
            <h1 className="text-lg font-semibold">Supershop Admin</h1>
          </div>
          <div className="p-4">
            <StoreSwitcher />
          </div>
        </div>

        <nav className="flex flex-col space-y-4 p-2">
          {renderNavigationGroup(MAIN_NAVIGATION, 'Main')}
          {renderNavigationGroup(MANAGEMENT_NAVIGATION, 'Management')}
          {renderNavigationGroup(ADDITIONAL_NAVIGATION, 'Additional')}
        </nav>

        {/* Logout button at bottom */}
        <div className="sticky bottom-0 bg-card border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          "md:ml-64" // Adjust margin when sidebar is visible
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}