import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, PanelLeft, X } from 'lucide-react'
import StoreSwitcher from '@/components/StoreSwitcher'
import { SidebarNavButton } from '@/components/layout/SidebarNavButton'
import { NavUser } from '@/components/nav-user'
import { 
  MAIN_NAVIGATION, 
  MANAGEMENT_NAVIGATION, 
  ADDITIONAL_NAVIGATION 
} from '@/config/navigation'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
            className="w-[calc(100%-0.5rem)] mx-auto" 
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

        <nav className="flex flex-col space-y-4 pl-3 pb-4 pr-1">
          {renderNavigationGroup(MAIN_NAVIGATION, 'Main')}
          {renderNavigationGroup(MANAGEMENT_NAVIGATION, 'Management')}
          {renderNavigationGroup(ADDITIONAL_NAVIGATION, 'Additional')}
        </nav>

        {/* User Navigation */}
        <div className="sticky bottom-0 bg-card border-t p-4">
          <NavUser user={user} />
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