import { 
  FiUser, FiLock, FiBell, FiMonitor, FiGlobe, 
  FiShield, FiCreditCard, FiGrid 
} from 'react-icons/fi'

export const SECTIONS = [
  { id: 'general', label: 'General', icon: FiUser },
  { id: 'security', label: 'Security', icon: FiLock },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'appearance', label: 'Appearance', icon: FiMonitor },
  { id: 'language', label: 'Language & Region', icon: FiGlobe },
  { id: 'privacy', label: 'Privacy', icon: FiShield },
  { id: 'billing', label: 'Billing', icon: FiCreditCard },
  { id: 'integrations', label: 'Integrations', icon: FiGrid }
] 