import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { accountAPI } from '@/services/api'
import { toast } from 'react-hot-toast'
import { 
  FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiImage, 
  FiBell, FiGlobe, FiMonitor, FiShield, FiCreditCard, FiGrid,
  FiTrash2, FiPlus, FiLinkedin, FiTwitter, FiFacebook, FiInstagram, FiGithub, FiLink, FiEdit2, FiCheck
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ImageUploadProgress } from '@/components/ui/ImageUploadProgress'
import { Switch } from "@/components/ui/switch"

const SECTIONS = [
  { id: 'general', label: 'General', icon: FiUser },
  { id: 'security', label: 'Security', icon: FiLock },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'appearance', label: 'Appearance', icon: FiMonitor },
  { id: 'language', label: 'Language & Region', icon: FiGlobe },
  { id: 'privacy', label: 'Privacy', icon: FiShield },
  { id: 'billing', label: 'Billing', icon: FiCreditCard },
  { id: 'integrations', label: 'Integrations', icon: FiGrid }
]

const THEMES = [
  { id: 'light', name: 'Light', color: '#ffffff' },
  { id: 'dark', name: 'Dark', color: '#1a1a1a' },
  { id: 'system', name: 'System', color: '#e2e8f0' }
]

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'bn', name: 'Bangla (বাংলা)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese (中文)' }
]

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', icon: '৳', color: '#E2136E' },
  { id: 'nagad', name: 'Nagad', icon: '৳', color: '#F7941D' },
  { id: 'rocket', name: 'Rocket', icon: '৳', color: '#8C3494' },
  { id: 'upay', name: 'Upay', icon: '৳', color: '#ED017F' },
  { id: 'bank', name: 'Bank Transfer', icon: '৳', color: '#0066B3' }
]

const BANGLADESH_BANKS = [
  { id: 'sonali', name: 'Sonali Bank' },
  { id: 'janata', name: 'Janata Bank' },
  { id: 'agrani', name: 'Agrani Bank' },
  { id: 'rupali', name: 'Rupali Bank' },
  { id: 'dbbl', name: 'Dutch-Bangla Bank' },
  { id: 'brac', name: 'BRAC Bank' },
  { id: 'city', name: 'City Bank' },
  { id: 'ebl', name: 'Eastern Bank' },
  // Add more banks as needed
]

const SOCIAL_LINKS = [
  { name: 'Select Type', placeholder: 'https://', icon: FiGlobe },
  { name: 'Personal Blog', placeholder: 'https://blog.example.com', icon: FiGlobe },
  { name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', icon: FiLinkedin },
  { name: 'Twitter', placeholder: 'https://twitter.com/username', icon: FiTwitter },
  { name: 'Facebook', placeholder: 'https://facebook.com/username', icon: FiFacebook },
  { name: 'Instagram', placeholder: 'https://instagram.com/username', icon: FiInstagram },
  { name: 'GitHub', placeholder: 'https://github.com/username', icon: FiGithub },
  { name: 'Custom', placeholder: 'https://', icon: FiLink }
];

export default function AccountSettings() {
  const { user, setUser } = useAuth()
  const [activeSection, setActiveSection] = useState('general')
  const [loading, setLoading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')
  const [formData, setFormData] = useState({
    // General
    fullName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    avatarUrl: '',
    websites: [],
    isEmailVerified: '',
    isPhoneVerified: '',
    isOnline: '',
    isActive: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    reducedMotion: false,
    
    // Language
    language: 'en',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    
    // Privacy
    profileVisibility: 'public',
    activityStatus: true,
    dataSharing: false,
    
    // Billing
    billingEmail: '',
    billingAddress: '',
    paymentMethod: '',
    
    // Integrations
    connectedApps: [],
    
    // Mobile Banking
    bkashNumber: '',
    nagadNumber: '',
    rocketNumber: '',
    upayNumber: ''
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        description: user.description || '',
        avatarUrl: user.avatarUrl || '',
        websites: user.websites || [],
        isEmailVisible: Boolean(user.isEmailVisible),
        isPhoneVisible: Boolean(user.isPhoneVisible),
        isOnline: Boolean(user.isOnline),
        isActive: Boolean(user.isActive),
        isEmailVerified: Boolean(user.isEmailVerified)
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const updateData = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
      avatarUrl: formData.avatarUrl,
      isEmailVisible: formData.isEmailVisible,
      isPhoneVisible: formData.isPhoneVisible,
      isOnline: formData.isOnline,
      isActive: formData.isActive,
      websites: formData.websites.filter(site => site.name && site.url)
    }

    try {
      const response = await accountAPI.updateProfile(updateData)
      if (response.success) {
        if (setUser && typeof setUser === 'function') {
          setUser(prev => ({
            ...prev,
            ...response.data
          }))
        }
        toast.success('Profile updated successfully')
      } else {
        toast.error(response.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setLoading(true)
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.onProgress = (progress) => {
      setUploadProgress(progress)
    }

    try {
      const response = await accountAPI.uploadAvatar(formData)
      
      if (response.success && response.data) {
        // Update both formData and user context with the new avatar URL
        setFormData(prev => ({
          ...prev,
          avatarUrl: response.data.url
        }))

        if (setUser && typeof setUser === 'function') {
          setUser(prev => ({
            ...prev,
            avatarUrl: response.data.url
          }))
        }
        
        toast.success('Avatar uploaded successfully')
      } else {
        toast.error(response.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setLoading(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }


  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }

  const handleWebsiteChange = (index, field, value) => {
    const newWebsites = [...formData.websites]
    newWebsites[index] = {
      ...newWebsites[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, websites: newWebsites }))
  }

  const addWebsite = () => {
    setFormData(prev => ({
      ...prev,
      websites: [...prev.websites, { name: '', url: '', type: '', isEditing: true }]
    }))
  }

  const removeWebsite = (index) => {
    setFormData(prev => ({
      ...prev,
      websites: prev.websites.filter((_, i) => i !== index)
    }))
  }

  const renderSideNav = () => (
    <div className="w-64 border-r bg-card">
      <nav className="space-y-1 p-4">
        {SECTIONS.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg
                ${activeSection === section.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`
                p-4 rounded-lg border-2 text-center space-y-2
                ${currentTheme === theme.id ? 'border-primary' : 'border-border'}
              `}
            >
              <div 
                className="w-full h-12 rounded-md mb-2"
                style={{ backgroundColor: theme.color }}
              />
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Font Size</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.fontSize}
          onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.reducedMotion}
            onChange={(e) => setFormData({ ...formData, reducedMotion: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span>Reduce motion</span>
        </label>
      </div>
    </div>
  )

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Language</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Time Zone</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.timeZone}
          onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
        >
          {Intl.supportedValuesOf('timeZone').map(zone => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Date Format</h3>
        <select
          className="w-full p-2 border rounded-md"
          value={formData.dateFormat}
          onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div>
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-gray-500">
                Use an authenticator app to generate one-time codes
              </p>
            </div>
            <Button
              onClick={() => {/* Handle 2FA setup */}}
              variant={formData.twoFactorEnabled ? "outline" : "default"}
            >
              {formData.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recovery Codes</p>
              <p className="text-sm text-gray-500">
                Generate backup codes for account recovery
              </p>
            </div>
            <Button variant="outline">Generate Codes</Button>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div>
        <h3 className="text-lg font-medium mb-4">Login History</h3>
        <div className="space-y-4">
          {/* Example login history items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Chrome on Windows</p>
                <p className="text-sm text-gray-500">IP: 192.168.1.1</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
          {/* Add more login history items */}
        </div>
      </div>

      {/* Security Log */}
      <div>
        <h3 className="text-lg font-medium mb-4">Security Log</h3>
        <div className="space-y-4">
          {/* Example security log items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Password changed</p>
                <p className="text-sm text-gray-500">IP: 192.168.1.1</p>
              </div>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
          </div>
          {/* Add more security log items */}
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Security Alerts</span>
              <p className="text-sm text-gray-500">Get notified about security events</p>
            </div>
            <input
              type="checkbox"
              checked={formData.securityAlerts}
              onChange={(e) => setFormData({ ...formData, securityAlerts: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Account Updates</span>
              <p className="text-sm text-gray-500">Get notified about account changes</p>
            </div>
            <input
              type="checkbox"
              checked={formData.accountUpdates}
              onChange={(e) => setFormData({ ...formData, accountUpdates: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </label>
          {/* Add more notification options */}
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Browser Notifications</span>
              <p className="text-sm text-gray-500">Show desktop notifications</p>
            </div>
            <input
              type="checkbox"
              checked={formData.browserNotifications}
              onChange={(e) => setFormData({ ...formData, browserNotifications: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </label>
          {/* Add more push notification options */}
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <div>
        <h3 className="text-lg font-medium mb-4">Profile Privacy</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Profile Visibility</label>
            <select
              className="w-full p-2 border rounded-md"
              value={formData.profileVisibility}
              onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Show Online Status</span>
              <p className="text-sm text-gray-500">Let others see when you're active</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(formData.showOnlineStatus)}
              onChange={(e) => setFormData({ ...formData, showOnlineStatus: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </label>
        </div>
      </div>

      {/* Data Privacy */}
      <div>
        <h3 className="text-lg font-medium mb-4">Data Privacy</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="font-medium">Data Collection</span>
              <p className="text-sm text-gray-500">Allow us to collect usage data</p>
            </div>
            <input
              type="checkbox"
              checked={formData.dataCollection}
              onChange={(e) => setFormData({ ...formData, dataCollection: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </label>
          <Button variant="outline" className="w-full">
            Download My Data
          </Button>
          <Button variant="outline" className="w-full text-red-500 hover:text-red-600">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )

  const renderBillingSection = () => (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {/* Mobile Banking */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Mobile Banking</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.slice(0, 4).map(method => (
                <div 
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{ borderColor: method.color }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      {formData[`${method.id}Number`] && (
                        <p className="text-sm text-gray-500">
                          •••• {formData[`${method.id}Number`].slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Handle adding/editing mobile banking number
                    }}
                  >
                    {formData[`${method.id}Number`] ? 'Edit' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Bank Account</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Bank</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                >
                  <option value="">Select a bank</option>
                  {BANGLADESH_BANKS.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  placeholder="Enter your account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankAccountName || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  placeholder="Enter account holder name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.bankBranch || ''}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                  placeholder="Enter branch name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium mb-4">Billing History</h3>
        <div className="space-y-4">
          {/* Example invoice */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">Invoice #1234</p>
              <p className="text-sm text-gray-500">Jan 1, 2024</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">৳2,999</span>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          </div>
          {/* Add more invoices as needed */}
        </div>
      </div>

      {/* Billing Address */}
      <div>
        <h3 className="text-lg font-medium mb-4">Billing Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.billingAddress || ''}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.billingCity || ''}
                onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Division</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.billingDivision || ''}
                onChange={(e) => setFormData({ ...formData, billingDivision: e.target.value })}
                placeholder="Enter division"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.billingPostalCode || ''}
              onChange={(e) => setFormData({ ...formData, billingPostalCode: e.target.value })}
              placeholder="Enter postal code"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      {/* Connected Apps */}
      <div>
        <h3 className="text-lg font-medium mb-4">Connected Applications</h3>
        <div className="space-y-4">
          {/* Example connected app */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div>
                <p className="font-medium">Google Drive</p>
                <p className="text-sm text-gray-500">Connected on Jan 1, 2024</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Disconnect</Button>
          </div>
          {/* Add more connected apps */}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h3 className="text-lg font-medium mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example available integration */}
          <div className="border p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div>
                <p className="font-medium">Slack</p>
                <p className="text-sm text-gray-500">Get notifications in Slack</p>
              </div>
            </div>
            <Button className="w-full mt-4">Connect</Button>
          </div>
          {/* Add more available integrations */}
        </div>
      </div>
    </div>
  )

  const renderGeneralSection = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden">
          <img
              src={formData.avatarUrl || '/default-avatar.png'}
            alt="Profile"
              className="h-full w-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                {isUploading && (
                  <span className="text-white text-sm mt-2">{uploadProgress}%</span>
                )}
              </div>
            )}
            {isUploading && <ImageUploadProgress progress={uploadProgress} />}
          </div>
          <label 
            className={`
              absolute bottom-0 right-0 
              bg-white rounded-full p-2 shadow-lg 
              cursor-pointer hover:bg-gray-50 
              transition-all duration-200 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
          >
            <FiImage className="h-4 w-4 text-gray-600" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={loading}
            />
          </label>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 2MB</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md bg-gray-50"
            value={formData.email}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Combined Websites & Social Links */}
      <div className="bg-gray-50/50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Websites & Social Links</h3>
          <button
            type="button"
            onClick={() => {
              addWebsite();
              setTimeout(() => {
                const newIndex = formData.websites.length;
                const elem = document.getElementById(`website-form-${newIndex}`);
                if (elem) {
                  elem.classList.remove('hidden');
                }
              }, 0);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.websites.map((website, index) => (
            <div key={index} className="relative">
              <div id={`website-display-${index}`} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                {!website.isEditing ? (
                  <>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {website.type && website.type !== 'Select Type' && (
                          <>
                            {SOCIAL_LINKS.find(link => link.name === website.type)?.icon && 
                              React.createElement(
                                SOCIAL_LINKS.find(link => link.name === website.type)?.icon,
                                { className: "h-5 w-5 text-gray-500" }
                              )
                            }
                          </>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {website.name || website.type}
                        </p>
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-500 hover:text-blue-600 hover:underline truncate block"
                        >
                          {website.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            websites: prev.websites.map((w, i) => 
                              i === index ? { ...w, isEditing: true } : w
                            )
                          }));
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeWebsite(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Type Selection */}
                    <div className="sm:col-span-3">
                      <select
                        className="w-full p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-primary/20"
                        value={website.type || ''}
                        onChange={(e) => {
                          const type = e.target.value;
                          handleWebsiteChange(index, 'type', type);
                          if (type !== 'Custom') {
                            handleWebsiteChange(index, 'name', type);
                          }
                        }}
                      >
                        {SOCIAL_LINKS.filter(link => link.name !== 'Select Type').map(link => (
                          <option key={link.name} value={link.name}>
                            {link.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Custom Name Input */}
                    {website.type === 'Custom' && (
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-primary/20"
                          value={website.name || ''}
                          onChange={(e) => handleWebsiteChange(index, 'name', e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>
                    )}
                    
                    {/* URL Input */}
                    <div className={`${website.type === 'Custom' ? 'sm:col-span-5' : 'sm:col-span-8'}`}>
                      <input
                        type="url"
                        className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-primary/20"
                        value={website.url || ''}
                        onChange={(e) => handleWebsiteChange(index, 'url', e.target.value)}
                        placeholder={
                          SOCIAL_LINKS.find(link => link.name === website.type)?.placeholder ||
                          'https://'
                        }
                      />
                    </div>

                    {/* Done Button */}
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            websites: prev.websites.map((w, i) => 
                              i === index ? { ...w, isEditing: false } : w
                            )
                          }));
                        }}
                        className="p-2.5 text-gray-400 hover:text-green-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {formData.websites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No websites or social links added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div>
        <h3 className="text-lg font-medium mb-4">Account Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Account Type</p>
              <p className="text-sm text-gray-500">Your current account level</p>
            </div>
            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
              {formData.accountType || 'Standard'}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-gray-500">Status of your email verification</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              formData.isEmailVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.isEmailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-50/50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-6">Profile Preferences</h3>
        <div className="space-y-6">
          {/* Email Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Email</label>
              <p className="text-sm text-muted-foreground">
                Display your email address on your public profile
              </p>
            </div>
            <Switch
              checked={Boolean(formData.isEmailVisible)}
              onCheckedChange={async (checked) => {
                try {
                  // First update the database
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isEmailVisible: checked
                  });
                  
                  if (response.success) {
                    // Only update UI if database update was successful
                    setFormData(prev => ({
                      ...prev,
                      isEmailVisible: checked
                    }));
                    
                    // Update user context
                    if (setUser && typeof setUser === 'function') {
                      setUser(prev => ({
                        ...prev,
                        isEmailVisible: checked
                      }));
                    }
                    
                    toast.success('Email visibility updated');
                  } else {
                    toast.error('Failed to update email visibility');
                  }
                } catch (error) {
                  console.error('Failed to update email visibility:', error);
                  toast.error('Failed to update email visibility');
                }
              }}
            />
          </div>

          {/* Phone Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Phone Number</label>
              <p className="text-sm text-muted-foreground">
                Display your phone number on your public profile
              </p>
            </div>
            <Switch
              checked={Boolean(formData.isPhoneVisible)}
              onCheckedChange={async (checked) => {
                try {
                  // First update the database
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isPhoneVisible: checked
                  });
                  
                  if (response.success) {
                    // Only update UI if database update was successful
                    setFormData(prev => ({
                      ...prev,
                      isPhoneVisible: checked
                    }));
                    
                    // Update user context
                    if (setUser && typeof setUser === 'function') {
                      setUser(prev => ({
                        ...prev,
                        isPhoneVisible: checked
                      }));
                    }
                    
                    toast.success('Phone visibility updated');
                  } else {
                    toast.error('Failed to update phone visibility');
                  }
                } catch (error) {
                  console.error('Failed to update phone visibility:', error);
                  toast.error('Failed to update phone visibility');
                }
              }}
            />
          </div>

          {/* Online Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Profile Activity</label>
              <p className="text-sm text-muted-foreground">
                Show your online status and activity
              </p>
            </div>
            <Switch
              checked={Boolean(formData.isOnline)}
              onCheckedChange={async (checked) => {
                try {
                  // First update the database
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isOnline: checked
                  });
                  
                  if (response.success) {
                    // Only update UI if database update was successful
                    setFormData(prev => ({
                      ...prev,
                      isOnline: checked
                    }));
                    
                    // Update user context
                    if (setUser && typeof setUser === 'function') {
                      setUser(prev => ({
                        ...prev,
                        isOnline: checked
                      }));
                    }
                    
                    toast.success('Online status updated');
                  } else {
                    toast.error('Failed to update online status');
                  }
                } catch (error) {
                  console.error('Failed to update online status:', error);
                  toast.error('Failed to update online status');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSection()
      case 'security':
        return renderSecuritySection()
      case 'notifications':
        return renderNotificationsSection()
      case 'appearance':
        return renderAppearanceSection()
      case 'language':
        return renderLanguageSection()
      case 'privacy':
        return renderPrivacySection()
      case 'billing':
        return renderBillingSection()
      case 'integrations':
        return renderIntegrationsSection()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="bg-card rounded-lg shadow-sm border">
          <div className="flex">
            {/* Side Navigation */}
            {renderSideNav()}

            {/* Main Content */}
            <div className="flex-1 p-6">
              <form onSubmit={handleSubmit}>
                {renderActiveSection()}

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-md hover:bg-accent"
                    onClick={() => {
                      if (user) {
                        setFormData(prev => ({
                          ...prev,
                          fullName: user.fullName || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          address: user.address || '',
                          description: user.description || '',
                          avatarUrl: user.avatarUrl || '',
                          websites: user.websites || [],
                          isEmailVisible: Boolean(user.isEmailVisible),
                          isPhoneVisible: Boolean(user.isPhoneVisible),
                          isOnline: Boolean(user.isOnline),
                          isActive: Boolean(user.isActive)
                        }))
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 