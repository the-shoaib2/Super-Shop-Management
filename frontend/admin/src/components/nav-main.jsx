"use client"

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const getIconClass = (title) => {
  const iconMap = {
    'Dashboard': 'dashboard',
    'Store': 'store',
    'Orders': 'orders',
    'Sales': 'sales',
    'Employees': 'employees',
    'Customers': 'customers',
    'Suppliers': 'suppliers',
    'Finance': 'finance',
    'Reports': 'reports',
    'Store APIs': 'api',
    'Account Settings': 'settings',
    'Overview': 'overview',
    'Analytics': 'analytics',
    'Products': 'products',
    'Categories': 'categories',
    'Inventory': 'inventory',
    'All Orders': 'all-orders',
    'Pending': 'pending',
    'Completed': 'completed',
    'Statistics': 'statistics',
    'Forecasts': 'forecasts',
    'All Staff': 'staff',
    'Roles': 'roles',
    'Performance': 'performance',
    'All Customers': 'users',
    'Segments': 'segments',
    'Feedback': 'feedback',
    'All Suppliers': 'truck',
    'Contracts': 'contracts',
    'Transactions': 'transactions',
    'Documentation': 'documentation',
    'Integration': 'integration',
    'Keys': 'key',
    'Profile': 'profile',
    'Security': 'security',
    'Preferences': 'preferences'
  };
  return iconMap[title] || '';
};

const IconWrapper = ({ icon: Icon, className, size = 5, isMain = false }) => {
  return (
    <Icon 
      className={`h-${size} w-${size} transition-colors duration-200 ${isMain ? 'group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5' : ''}`}
      style={{ 
        color: `hsl(var(--${className}-icon))`
      }}
    />
  );
};

export function NavMain({
  items = []
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  className={cn(
                    "group-data-[collapsible=icon]:p-3",
                    item.isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  {item.icon && <IconWrapper icon={item.icon} className={getIconClass(item.title)} isMain={true} />}
                  <span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:group-hover:block group-data-[collapsible=icon]:group-hover:absolute group-data-[collapsible=icon]:group-hover:left-12 group-data-[collapsible=icon]:group-hover:bg-sidebar-accent group-data-[collapsible=icon]:group-hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:group-hover:px-2 group-data-[collapsible=icon]:group-hover:py-1 group-data-[collapsible=icon]:group-hover:rounded-md group-data-[collapsible=icon]:group-hover:shadow-md group-data-[collapsible=icon]:group-hover:z-50 group-data-[collapsible=icon]:group-hover:whitespace-nowrap">
                    {item.title}
                  </span>

                  <ChevronRight
                    className="ml-auto transition-transform duration-150 ease-out will-change-transform group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all duration-150 ease-out will-change-transform">
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link 
                          to={subItem.url} 
                          className={cn(
                            "relative group/sub-item",
                            subItem.isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          {subItem.icon && <IconWrapper icon={subItem.icon} className={getIconClass(subItem.title)} size={4} />}
                          <span>{subItem.title}</span>
                          {subItem.isActive && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-green-500 transition-all duration-200 group-hover/sub-item:bg-green-400 group-hover/sub-item:scale-110" />
                          )}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
    </SidebarMenu>
  );
}
