import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
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
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Search } from '@/components/ui/search'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
    <SidebarProvider>
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
          <SidebarInset className="flex-1">
            <header
              className="fixed top-0 right-0 left-64 z-30 flex h-16 shrink-0 items-center justify-between px-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{location.pathname.replace('/', '') || 'Dashboard'}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              
              <div className="flex items-center gap-4">
                <Search />
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <div className="pt-16 flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
              <Outlet />
            </div>
          </SidebarInset>
        </main>
      </div>
    </SidebarProvider>
  )
}