import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { accountAPI } from '@/services/api'
import { toast } from 'react-hot-toast'
import { SideNav } from './components/SideNav'
import { GeneralSection } from './sections/GeneralSection'
import { SecuritySection } from './sections/SecuritySection'
import { NotificationsSection } from './sections/NotificationsSection'
import { AppearanceSection } from './sections/AppearanceSection'
import { LanguageSection } from './sections/LanguageSection'
import { PrivacySection } from './sections/PrivacySection'
import { BillingSection } from './sections/BillingSection'
import { IntegrationsSection } from './sections/IntegrationsSection'

// Form Actions Component
const FormActions = ({ loading, onCancel }) => (
  <div className="mt-6 flex justify-end space-x-4">
    <button
      type="button"
      className="px-4 py-2 border rounded-md hover:bg-accent"
      onClick={onCancel}
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
)

// Section Map
const SECTIONS = {
  general: GeneralSection,
  security: SecuritySection,
  notifications: NotificationsSection,
  appearance: AppearanceSection,
  language: LanguageSection,
  privacy: PrivacySection,
  billing: BillingSection,
  integrations: IntegrationsSection
}

// Initial form state
const initialFormState = {
  // General
  fullName: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  avatarUrl: '',
  websites: [],
  isEmailVerified: false,
  isPhoneVerified: false,
  isOnline: false,
  isActive: false,
  isEmailVisible: false,
  isPhoneVisible: false,
  isVerified: false,
  
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
}

export default function AccountSettings() {
  const { user, setUser } = useAuth()
  const [activeSection, setActiveSection] = useState('general')
  const [loading, setLoading] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('light')
  const [formData, setFormData] = useState(initialFormState)

  // Sync form data with user data
  useEffect(() => {
    if (!user) return

    const booleanFields = {
      isEmailVisible: user.isEmailVisible,
      isPhoneVisible: user.isPhoneVisible,
      isOnline: user.isOnline,
      isActive: user.isActive,
      isVerified: user.isVerified
    }

    const convertedBooleans = Object.fromEntries(
      Object.entries(booleanFields).map(([key, value]) => [key, value === true])
    )

    setFormData(prev => ({
      ...prev,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      description: user.description || '',
      avatarUrl: user.avatarUrl || '',
      websites: user.websites || [],
      ...convertedBooleans,
      isEmailVerified: convertedBooleans.isVerified
    }))
  }, [user])

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
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
      isVerified: formData.isVerified,
      websites: formData.websites.filter(site => site.name && site.url)
    }

    try {
      const response = await accountAPI.updateProfile(updateData)
      if (response.success) {
        setUser(prev => ({ ...prev, ...response.data }))
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
  }, [formData, setUser])

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    if (!user) return

    setFormData({
      ...initialFormState,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      description: user.description || '',
      avatarUrl: user.avatarUrl || '',
      websites: user.websites || [],
      isEmailVisible: user.isEmailVisible === true,
      isPhoneVisible: user.isPhoneVisible === true,
      isOnline: user.isOnline === true,
      isActive: user.isActive === true,
      isVerified: user.isVerified === true,
      isEmailVerified: user.isVerified === true
    })
  }, [user])

  // Get active section component
  const ActiveSection = SECTIONS[activeSection]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="bg-card rounded-lg shadow-sm border">
          <div className="flex">
            <SideNav activeSection={activeSection} setActiveSection={setActiveSection} />

            <div className="flex-1 p-6">
              <form onSubmit={handleSubmit}>
                {ActiveSection && (
                  <ActiveSection
                    formData={formData}
                    setFormData={setFormData}
                    setUser={setUser}
                    loading={loading}
                    setLoading={setLoading}
                    currentTheme={currentTheme}
                    setCurrentTheme={setCurrentTheme}
                  />
                )}
                <FormActions loading={loading} onCancel={handleCancel} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 