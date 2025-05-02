import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useStore } from "@/contexts/store-context"
import CreateStoreDialog from "@/components/dialogs/create-store-dialog"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { 
    currentStore, 
    stores, 
    loading, 
    switchStore,
    createStore 
  } = useStore()
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [isSwitching, setIsSwitching] = React.useState(false)

  const handleStoreCreated = (newStore) => {
    setShowCreateDialog(false)
  }

  const handleSwitchStore = async (storeId) => {
    if (isSwitching || storeId === currentStore?.id) return;
    
    setIsSwitching(true);
    try {
      const success = await switchStore(storeId);
      if (!success) {
        // Handle switch failure if needed
      }
    } finally {
      setIsSwitching(false);
    }
  }

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className="h-12 w-full" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors group-data-[collapsible=icon]:justify-center"
                disabled={isSwitching}
              >
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-10">
                  <span className="text-lg font-bold group-data-[collapsible=icon]:text-xl">
                    {currentStore?.name?.charAt(0)}
                  </span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">
                    {currentStore?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentStore?.category || 'No category'}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border bg-background shadow-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}>
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                Your Stores
              </DropdownMenuLabel>
              {stores.map((store) => (
                <DropdownMenuItem 
                  key={store.id} 
                  onClick={() => handleSwitchStore(store.id)} 
                  className="gap-2 p-2 hover:bg-accent cursor-pointer"
                  disabled={isSwitching || store.id === currentStore?.id}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border bg-background">
                    <span className="text-sm font-bold">{store.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{store.name}</span>
                    <span className="text-xs text-muted-foreground">{store.category || 'No category'}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem 
                className="gap-2 p-2 hover:bg-accent cursor-pointer"
                onClick={() => setShowCreateDialog(true)}
                disabled={isSwitching}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium">Create New Store</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateStoreDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        onStoreCreated={handleStoreCreated}
      />
    </>
  );
}
