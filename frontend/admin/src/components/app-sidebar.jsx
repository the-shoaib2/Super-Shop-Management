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
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "Acme Inc",
      plan: "Pro",
      logo: Store,
      iconColor: "store"
    },
    {
      name: "Monsters Inc",
      plan: "Enterprise",
      logo: Store,
      iconColor: "store"
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
            { title: "Overview", url: "/dashboard/overview", icon: Home, className: "overview" },
            { title: "Analytics", url: "/dashboard/analytics", icon: BarChart4, className: "analytics" },
            { title: "Reports", url: "/dashboard/reports", icon: FileText, className: "reports" }
          ]
        },
        {
          title: "Store",
          url: "/store",
          icon: Store,
          items: [
            { title: "Products", url: "/store/products", icon: Package, className: "products" },
            { title: "Categories", url: "/store/categories", icon: List, className: "categories" },
            { title: "Inventory", url: "/store/inventory", icon: Box, className: "inventory" }
          ]
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
          items: [
            { title: "All Orders", url: "/orders/all", icon: ShoppingBag, className: "all-orders" },
            { title: "Pending", url: "/orders/pending", icon: Clock, className: "pending" },
            { title: "Completed", url: "/orders/completed", icon: CheckCircle, className: "completed" }
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
            { title: "Overview", url: "/sales/overview", icon: TrendingUp, className: "trending-up" },
            { title: "Statistics", url: "/sales/statistics", icon: PieChart, className: "statistics" },
            { title: "Forecasts", url: "/sales/forecasts", icon: LineChart, className: "forecasts" }
          ]
        },
        {
          title: "Employees",
          url: "/employees",
          icon: Users,
          items: [
            { title: "All Staff", url: "/employees/all", icon: Users2, className: "staff" },
            { title: "Roles", url: "/employees/roles", icon: UserCog, className: "roles" },
            { title: "Performance", url: "/employees/performance", icon: Award, className: "performance" }
          ]
        },
        {
          title: "Customers",
          url: "/customers",
          icon: UserPlus,
          items: [
            { title: "All Customers", url: "/customers/all", icon: Users2, className: "users" },
            { title: "Segments", url: "/customers/segments", icon: Tag, className: "segments" },
            { title: "Feedback", url: "/customers/feedback", icon: MessageSquare, className: "feedback" }
          ]
        },
        {
          title: "Suppliers",
          url: "/suppliers",
          icon: Truck,
          items: [
            { title: "All Suppliers", url: "/suppliers/all", icon: TruckIcon, className: "truck" },
            { title: "Contracts", url: "/suppliers/contracts", icon: FileCheck, className: "contracts" },
            { title: "Performance", url: "/suppliers/performance", icon: BarChart, className: "bar-chart" }
          ]
        },
        {
          title: "Finance",
          url: "/finance",
          icon: CreditCard,
          items: [
            { title: "Overview", url: "/finance/overview", icon: Wallet, className: "wallet" },
            { title: "Transactions", url: "/finance/transactions", icon: Receipt, className: "transactions" },
            { title: "Reports", url: "/finance/reports", icon: FileSpreadsheet, className: "spreadsheet" }
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
            { title: "Sales Reports", url: "/reports/sales", icon: BookOpen, className: "book" },
            { title: "Inventory Reports", url: "/reports/inventory", icon: Box, className: "box" },
            { title: "Custom Reports", url: "/reports/custom", icon: FileText, className: "file-text" }
          ]
        },
        {
          title: "Store APIs",
          url: "/store-apis",
          icon: Code,
          items: [
            { title: "Documentation", url: "/store-apis/docs", icon: BookOpen, className: "documentation" },
            { title: "Integration", url: "/store-apis/integration", icon: Terminal, className: "integration" },
            { title: "Keys", url: "/store-apis/keys", icon: Key, className: "key" }
          ]
        },
        {
          title: "Account Settings",
          url: "/account-settings",
          icon: Settings,
          items: [
            { title: "Profile", url: "/account-settings/profile", icon: UserCircle, className: "profile" },
            { title: "Security", url: "/account-settings/security", icon: Lock, className: "security" },
            { title: "Preferences", url: "/account-settings/preferences", icon: Bell, className: "preferences" }
          ]
        }
      ]
    }
  ]
}

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
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
