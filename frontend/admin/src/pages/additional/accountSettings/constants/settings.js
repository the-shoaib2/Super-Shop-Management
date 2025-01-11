import { 
  FiGlobe, FiLinkedin, FiTwitter, FiFacebook, 
  FiInstagram, FiGithub, FiLink 
} from 'react-icons/fi'

export const THEMES = [
  { id: 'light', name: 'Light', color: '#ffffff' },
  { id: 'dark', name: 'Dark', color: '#1a1a1a' },
  { id: 'system', name: 'System', color: '#e2e8f0' }
]

export const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'bn', name: 'Bangla (বাংলা)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' }
]

export const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', icon: '৳', color: '#E2136E' },
  { id: 'nagad', name: 'Nagad', icon: '৳', color: '#F7941D' },
  { id: 'rocket', name: 'Rocket', icon: '৳', color: '#8C3494' },
  { id: 'upay', name: 'Upay', icon: '৳', color: '#ED017F' },
  { id: 'bank', name: 'Bank Transfer', icon: '৳', color: '#0066B3' }
]

export const BANGLADESH_BANKS = [
  { id: 'sonali', name: 'Sonali Bank' },
  { id: 'janata', name: 'Janata Bank' },
  { id: 'agrani', name: 'Agrani Bank' },
  { id: 'rupali', name: 'Rupali Bank' },
  { id: 'dbbl', name: 'Dutch-Bangla Bank' },
  { id: 'brac', name: 'BRAC Bank' },
  { id: 'city', name: 'City Bank' },
  { id: 'ebl', name: 'Eastern Bank' }
]

export const SOCIAL_LINKS = [
  { name: 'Select Type', placeholder: 'https://', icon: FiGlobe },
  { name: 'Personal Blog', placeholder: 'https://blog.example.com', icon: FiGlobe },
  { name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: FiLinkedin },
  { name: 'Twitter', placeholder: 'https://twitter.com/username', icon: FiTwitter },
  { name: 'Facebook', placeholder: 'https://facebook.com/username', icon: FiFacebook },
  { name: 'Instagram', placeholder: 'https://instagram.com/username', icon: FiInstagram },
  { name: 'GitHub', placeholder: 'https://github.com/username', icon: FiGithub },
  { name: 'Custom', placeholder: 'https://', icon: FiLink }
] 