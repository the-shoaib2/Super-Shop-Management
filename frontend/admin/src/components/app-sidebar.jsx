import * as React from "react"
import { Command } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { NavUser } from "@/components/nav-user"
import { getNavItems, commonNavItems } from "@/config/app-navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }) {
  const { user } = useAuth()
  const userRole = user?.role || 'GUEST'

  const navMainItems = React.useMemo(() => 
    getNavItems(userRole), [userRole]
  )

  const getInitials = (user) => {
    if (!user || !user?.fullName) return 'GU'
    const names = user.fullName.split(' ')
    return `${names[0]?.charAt(0)}${names[names.length - 1]?.charAt(0)}`.toUpperCase()
  }

  // Helper function to format role names
  const formatRoleName = (role) => {
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const sidebarData = {
    user: {
      name: user?.fullName || 'Guest User',
      email: user?.email || 'guest@example.com',
      avatar: user?.avatar || null,
      initials: getInitials(user)
    },
    navMain: navMainItems,
    navSecondary: commonNavItems
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30">
      <div className="sticky top-0 bg-card z-10">
        <div className="flex h-16 items-center border-b px-6 justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Supershop Admin</span>
              <span className="truncate text-xs text-muted-foreground">{formatRoleName(userRole)}</span>
            </div>
          </Link>
        </div>
      </div>

      <nav className="flex flex-col space-y-4 p-4">
        {/* Main Navigation */}
        {sidebarData.navMain.map((group, index) => (
          <div key={index} className="space-y-4">
            <div className="px-3">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {group.title}
              </h2>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* User Navigation */}
      <div className="sticky bottom-0 bg-card border-t p-4">
        <NavUser user={sidebarData.user} />
      </div>
    </aside>
  )
}