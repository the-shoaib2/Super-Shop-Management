import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { accountAPI } from '@/services/api'

export function SecuritySection({ formData, setFormData }) {
  const [loading, setLoading] = useState(false)
  const [loginHistory, setLoginHistory] = useState([])
  const [securityLog, setSecurityLog] = useState([])

  useEffect(() => {
    fetchLoginHistory()
    fetchSecurityLog()
  }, [])

  const fetchLoginHistory = async () => {
    try {
      const response = await accountAPI.getLoginHistory()
      if (response.success) {
        setLoginHistory(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch login history:', error)
    }
  }

  const fetchSecurityLog = async () => {
    try {
      const response = await accountAPI.getSecurityLog()
      if (response.success) {
        setSecurityLog(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch security log:', error)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (!formData.currentPassword) {
      toast.error('Please enter your current password')
      return
    }
    if (!formData.newPassword) {
      toast.error('Please enter a new password')
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      const response = await accountAPI.changePassword(
        formData.currentPassword,
        formData.newPassword
      )
      
      if (response.success) {
        toast.success('Password changed successfully')
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        // Refresh security log
        fetchSecurityLog()
      } else {
        toast.error(response.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      toast.error(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSetup = async () => {
    try {
      if (formData.twoFactorEnabled) {
        // Handle 2FA disable
        const response = await accountAPI.disableTwoFactor()
        if (response.success) {
          setFormData(prev => ({ ...prev, twoFactorEnabled: false }))
          toast.success('Two-factor authentication disabled')
        }
      } else {
        // Handle 2FA setup
        const response = await accountAPI.setupTwoFactor()
        if (response.success) {
          // Show QR code and handle verification
          // This would typically open a modal with the QR code
          console.log('2FA setup response:', response)
        }
      }
    } catch (error) {
      console.error('Failed to handle 2FA:', error)
      toast.error('Failed to handle two-factor authentication')
    }
  }

  const handleGenerateRecoveryCodes = async () => {
    try {
      const response = await accountAPI.generateRecoveryCodes()
      if (response.success) {
        // Show recovery codes to user
        // This would typically open a modal with the codes
        console.log('Recovery codes:', response.data)
      }
    } catch (error) {
      console.error('Failed to generate recovery codes:', error)
      toast.error('Failed to generate recovery codes')
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <form onSubmit={handlePasswordChange}>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </div>
      </form>

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
              onClick={handleTwoFactorSetup}
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
            <Button 
              variant="outline"
              onClick={handleGenerateRecoveryCodes}
              disabled={!formData.twoFactorEnabled}
            >
              Generate Codes
            </Button>
          </div>
        </div>
      </div>

      {/* Login History */}
      <div>
        <h3 className="text-lg font-medium mb-4">Login History</h3>
        <div className="space-y-4">
          {loginHistory.length > 0 ? (
            loginHistory.map((login, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{login.browser} on {login.os}</p>
                    <p className="text-sm text-gray-500">IP: {login.ip}</p>
                  </div>
                  <span className="text-sm text-gray-500">{login.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No login history available</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Log */}
      <div>
        <h3 className="text-lg font-medium mb-4">Security Log</h3>
        <div className="space-y-4">
          {securityLog.length > 0 ? (
            securityLog.map((event, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{event.action}</p>
                    <p className="text-sm text-gray-500">IP: {event.ip}</p>
                  </div>
                  <span className="text-sm text-gray-500">{event.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No security events recorded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 