import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { accountAPI } from '@/services/api'
import { toast } from 'react-hot-toast'
import { 
  FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiImage, 
  FiBell, FiGlobe, FiMonitor, FiShield, FiCreditCard, FiGrid 
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ImageUploadProgress } from '@/components/ui/ImageUploadProgress'

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
    bio: '',
    avatar: '',
    
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
        bio: user.bio || '',
        avatar: user.avatar || ''
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await accountAPI.updateProfile(formData)
      if (response.data?.success) {
        setUser(response.data.data)
        toast.success('Settings updated successfully')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast.error(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await accountAPI.uploadAvatar(formData)
      if (response.success && response.data?.url) {
        setFormData(prev => ({ ...prev, avatar: response.data.url }))
        
        if (typeof setUser === 'function') {
          setUser(prev => ({ ...prev, avatar: response.data.url }))
        }
        
        toast.success('Avatar uploaded successfully')
      } else {
        toast.error(response.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error('Failed to upload avatar')
    } finally {
      setLoading(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }


  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
    // Apply theme logic here
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
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
              checked={formData.showOnlineStatus}
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
              src={formData.avatar || '/default-avatar.png'}
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

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Social Links */}
      <div>
        <h3 className="text-lg font-medium mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md"
              value={formData.twitter || ''}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              placeholder="https://twitter.com/username"
            />
          </div>
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
              formData.emailVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-medium mb-4">Profile Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.emailVisible || false}
              onChange={(e) => setFormData({ ...formData, emailVisible: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Show email on profile</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.phoneVisible || false}
              onChange={(e) => setFormData({ ...formData, phoneVisible: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span>Show phone number on profile</span>
          </label>
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
                    onClick={() => setFormData({
                      fullName: user?.fullName || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      address: user?.address || '',
                      bio: user?.bio || '',
                      avatar: user?.avatar || ''
                    })}
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