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
    'Dashboard': 'dashboard-icon',
    'Store': 'store-icon',
    'Orders': 'orders-icon',
    'Sales': 'sales-icon',
    'Employees': 'employees-icon',
    'Customers': 'customers-icon',
    'Suppliers': 'suppliers-icon',
    'Finance': 'finance-icon',
    'Reports': 'reports-icon',
    'Store APIs': 'api-icon',
    'Account Settings': 'settings-icon'
  };
  return iconMap[title] || '';
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
                  {item.icon && <item.icon className={`h-5 w-5 ${getIconClass(item.title)}`} />}
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
                          {subItem.icon && <subItem.icon className={`h-4 w-4 ${getIconClass(item.title)}`} />}
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
