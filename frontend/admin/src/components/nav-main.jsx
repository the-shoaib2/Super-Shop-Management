"use client"

import { ChevronRight } from "lucide-react";

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

const IconWrapper = ({ icon: Icon, className, size = 5 }) => {
  return (
    <Icon 
      className={`h-${size} w-${size} transition-colors duration-200`}
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
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <IconWrapper icon={item.icon} className={getIconClass(item.title)} />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className="ml-auto transition-transform duration-150 ease-out will-change-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all duration-150 ease-out will-change-transform">
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          {subItem.icon && <IconWrapper icon={subItem.icon} className={getIconClass(subItem.title)} size={4} />}
                          <span>{subItem.title}</span>
                        </a>
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
