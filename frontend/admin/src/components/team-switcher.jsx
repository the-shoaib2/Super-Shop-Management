import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { storeAPI } from "@/services/api"
import { toast } from "react-hot-toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function StoreSwitcher() {
  const { isMobile } = useSidebar()
  const { currentStore, setCurrentStore } = useAuth()
  const [stores, setStores] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getOwnerStores()
      
      if (response.success && response.data) {
        const validStores = response.data.filter(store => 
          store && store.id && store.name
        )
        
        setStores(validStores)
        
        if (!currentStore && validStores.length > 0) {
          setCurrentStore(validStores[0])
        }
      } else {
        console.error('Failed to fetch stores:', response.error)
        toast.error(response.error || 'Failed to load stores')
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      toast.error(error.response?.data?.message || 'Failed to load stores')
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSwitch = async (store) => {
    try {
      const response = await storeAPI.switchStore(store.id)
      if (response.success) {
        setCurrentStore(store)
        toast.success(`Switched to ${store.name}`)
      } else {
        throw new Error(response.message || 'Failed to switch store')
      }
    } catch (error) {
      console.error('Failed to switch store:', error)
      toast.error(error.response?.data?.message || 'Failed to switch store')
    }
  }

  if (!currentStore) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-lg font-bold">{currentStore.name.charAt(0)}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentStore.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentStore.category || 'No category'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem 
                key={store.id} 
                onClick={() => handleStoreSwitch(store)} 
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <span className="text-sm font-bold">{store.name.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span>{store.name}</span>
                  <span className="text-xs text-muted-foreground">{store.category || 'No category'}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div
                className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
