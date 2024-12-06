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
  Settings, 
  Code 
} from 'lucide-react'

export const MAIN_NAVIGATION = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'main'
  },
  {
    path: '/store',
    label: 'Store',
    icon: Store,
    group: 'main'
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: ShoppingCart,
    group: 'main'
  }
]

export const MANAGEMENT_NAVIGATION = [
  {
    path: '/sales',
    label: 'Sales',
    icon: BarChart4,
    group: 'management'
  },
  {
    path: '/employees',
    label: 'Employees',
    icon: Users,
    group: 'management'
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: UserPlus,
    group: 'management'
  },
  {
    path: '/suppliers',
    label: 'Suppliers',
    icon: Truck,
    group: 'management'
  },
  {
    path: '/finance',
    label: 'Finance',
    icon: CreditCard,
    group: 'management'
  }
]

export const ADDITIONAL_NAVIGATION = [
  {
    path: '/reports',
    label: 'Reports',
    icon: FileText,
    group: 'additional'
  },
  {
    path: '/apis',
    label: 'APIs',
    icon: Code,
    group: 'additional'
  },
  {
    path: '/account-settings',
    label: 'Account Settings',
    icon: Settings,
    group: 'additional'
  }
]

export const ALL_NAVIGATION = [
  ...MAIN_NAVIGATION,
  ...MANAGEMENT_NAVIGATION,
  ...ADDITIONAL_NAVIGATION
]
