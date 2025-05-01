import * as React from "react"
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  BarChart4,
  Users,
  UserPlus,
  Truck,
  CreditCard,
  FileText,
  Code,
  Settings,
  ChevronRight,
  Home,
  Package,
  List,
  Box,
  Tag,
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  PieChart,
  LineChart,
  UserCog,
  Shield,
  Award,
  Users2,
  Heart,
  MessageSquare,
  TruckIcon,
  FileCheck,
  BarChart,
  Wallet,
  Receipt,
  FileSpreadsheet,
  BookOpen,
  Terminal,
  Key,
  UserCircle,
  Lock,
  Bell
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

const data = {
  teams: [
    {
      name: "Acme Inc",
      plan: "Pro",
      logo: Store
    },
    {
      name: "Monsters Inc",
      plan: "Enterprise",
      logo: Store
    }
  ],
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/01.png"
  },
  projects: [],
  navMain: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          isActive: true,
          items: [
            { title: "Overview", url: "/dashboard/overview", icon: Home },
            { title: "Analytics", url: "/dashboard/analytics", icon: BarChart4 },
            { title: "Reports", url: "/dashboard/reports", icon: FileText }
          ]
        },
        {
          title: "Store",
          url: "/store",
          icon: Store,
          items: [
            { title: "Products", url: "/store/products", icon: Package },
            { title: "Categories", url: "/store/categories", icon: List },
            { title: "Inventory", url: "/store/inventory", icon: Box }
          ]
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          items: [
            { title: "All Orders", url: "/orders/all", icon: ShoppingBag },
            { title: "Pending", url: "/orders/pending", icon: Clock },
            { title: "Completed", url: "/orders/completed", icon: CheckCircle }
          ]
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          title: "Sales",
          url: "/sales",
          icon: BarChart4,
          items: [
            { title: "Overview", url: "/sales/overview", icon: TrendingUp },
            { title: "Statistics", url: "/sales/statistics", icon: PieChart },
            { title: "Forecasts", url: "/sales/forecasts", icon: LineChart }
          ]
        },
        {
          title: "Employees",
          url: "/employees",
          icon: Users,
          items: [
            { title: "All Staff", url: "/employees/all", icon: Users2 },
            { title: "Roles", url: "/employees/roles", icon: UserCog },
            { title: "Performance", url: "/employees/performance", icon: Award }
          ]
        },
        {
          title: "Customers",
          url: "/customers",
          icon: UserPlus,
          items: [
            { title: "All Customers", url: "/customers/all", icon: Users2 },
            { title: "Segments", url: "/customers/segments", icon: Tag },
            { title: "Feedback", url: "/customers/feedback", icon: MessageSquare }
          ]
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: Truck,
          items: [
            { title: "All Suppliers", url: "/suppliers/all", icon: TruckIcon },
            { title: "Contracts", url: "/suppliers/contracts", icon: FileCheck },
            { title: "Performance", url: "/suppliers/performance", icon: BarChart }
          ]
        },
        {
          title: "Finance",
          url: "/finance",
          icon: CreditCard,
          items: [
            { title: "Overview", url: "/finance/overview", icon: Wallet },
            { title: "Transactions", url: "/finance/transactions", icon: Receipt },
            { title: "Reports", url: "/finance/reports", icon: FileSpreadsheet }
          ]
        }
      ]
    },
    {
      title: "Additional",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: FileText,
          items: [
            { title: "Sales Reports", url: "/reports/sales", icon: BookOpen },
            { title: "Inventory Reports", url: "/reports/inventory", icon: Box },
            { title: "Custom Reports", url: "/reports/custom", icon: FileText }
          ]
        },
        {
          title: "Store APIs",
          url: "/store-apis",
          icon: Code,
          items: [
            { title: "Documentation", url: "/store-apis/docs", icon: BookOpen },
            { title: "Integration", url: "/store-apis/integration", icon: Terminal },
            { title: "Keys", url: "/store-apis/keys", icon: Key }
          ]
        },
        {
          title: "Account Settings",
          url: "/account-settings",
          icon: Settings,
          items: [
            { title: "Profile", url: "/account-settings/profile", icon: UserCircle },
            { title: "Security", url: "/account-settings/security", icon: Lock },
            { title: "Preferences", url: "/account-settings/preferences", icon: Bell }
          ]
        }
      ]
    }
  ]
}

const getIconClass = (title) => {
  const iconMap = {
    // Main menu items
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
    'Account Settings': 'settings-icon',
    
    // Dashboard sub-items
    'Overview': 'home-icon',
    'Analytics': 'bar-chart-icon',
    'Reports': 'file-text-icon',
    
    // Store sub-items
    'Products': 'package-icon',
    'Categories': 'list-icon',
    'Inventory': 'box-icon',
    
    // Orders sub-items
    'All Orders': 'shopping-bag-icon',
    'Pending': 'clock-icon',
    'Completed': 'check-circle-icon',
    
    // Sales sub-items
    'Statistics': 'pie-chart-icon',
    'Forecasts': 'line-chart-icon',
    
    // Employees sub-items
    'Staff': 'users-icon',
    'Roles': 'user-cog-icon',
    'Performance': 'award-icon',
    
    // Customers sub-items
    'Segments': 'tag-icon',
    'Feedback': 'message-icon',
    
    // Suppliers sub-items
    'Contracts': 'file-check-icon',
    
    // Finance sub-items
    'Transactions': 'receipt-icon',
    
    // Store APIs sub-items
    'Documentation': 'book-icon',
    'Integration': 'terminal-icon',
    
    // Account Settings sub-items
    'Profile': 'user-circle-icon',
    'Security': 'lock-icon',
    'Preferences': 'bell-icon',
    
    // Additional icons
    'Home': 'home-icon',
    'Package': 'package-icon',
    'List': 'list-icon',
    'Box': 'box-icon',
    'Tag': 'tag-icon',
    'ShoppingBag': 'shopping-bag-icon',
    'Clock': 'clock-icon',
    'CheckCircle': 'check-circle-icon',
    'TrendingUp': 'trending-up-icon',
    'PieChart': 'pie-chart-icon',
    'LineChart': 'line-chart-icon',
    'UserCog': 'user-cog-icon',
    'Shield': 'shield-icon',
    'Award': 'award-icon',
    'Users2': 'users-icon',
    'Heart': 'heart-icon',
    'MessageSquare': 'message-icon',
    'TruckIcon': 'truck-icon',
    'FileCheck': 'file-check-icon',
    'BarChart': 'bar-chart-icon',
    'Wallet': 'wallet-icon',
    'Receipt': 'receipt-icon',
    'FileSpreadsheet': 'spreadsheet-icon',
    'BookOpen': 'book-icon',
    'Terminal': 'terminal-icon',
    'Key': 'key-icon',
    'UserCircle': 'user-circle-icon',
    'Lock': 'lock-icon',
    'Bell': 'bell-icon',
    'FileText': 'file-text-icon'
  };
  return iconMap[title] || '';
};

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <NavMain items={group.items} />
          </SidebarGroup>
        ))}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
