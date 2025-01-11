import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from 'react-hot-toast'
import { accountAPI } from '@/services/api'

export function PrivacySection({ formData, setFormData, setUser }) {
  return (
    <div className="space-y-6">
      {/* Profile Preferences */}
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
              checked={formData.isEmailVisible || false}
              onCheckedChange={async (checked) => {
                try {
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isEmailVisible: checked
                  })
                  
                  if (response.success) {
                    setFormData(prev => ({
                      ...prev,
                      isEmailVisible: checked
                    }))
                    
                    if (setUser) {
                      setUser(prev => ({
                        ...prev,
                        isEmailVisible: checked
                      }))
                    }
                    
                    toast.success('Email visibility updated')
                  } else {
                    toast.error('Failed to update email visibility')
                  }
                } catch (error) {
                  console.error('Failed to update email visibility:', error)
                  toast.error('Failed to update email visibility')
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
              checked={formData.isPhoneVisible || false}
              onCheckedChange={async (checked) => {
                try {
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isPhoneVisible: checked
                  })
                  
                  if (response.success) {
                    setFormData(prev => ({
                      ...prev,
                      isPhoneVisible: checked
                    }))
                    
                    if (setUser) {
                      setUser(prev => ({
                        ...prev,
                        isPhoneVisible: checked
                      }))
                    }
                    
                    toast.success('Phone visibility updated')
                  } else {
                    toast.error('Failed to update phone visibility')
                  }
                } catch (error) {
                  console.error('Failed to update phone visibility:', error)
                  toast.error('Failed to update phone visibility')
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
              checked={formData.isOnline || false}
              onCheckedChange={async (checked) => {
                try {
                  const response = await accountAPI.updateProfile({
                    ...formData,
                    isOnline: checked
                  })
                  
                  if (response.success) {
                    setFormData(prev => ({
                      ...prev,
                      isOnline: checked
                    }))
                    
                    if (setUser) {
                      setUser(prev => ({
                        ...prev,
                        isOnline: checked
                      }))
                    }
                    
                    toast.success('Online status updated')
                  } else {
                    toast.error('Failed to update online status')
                  }
                } catch (error) {
                  console.error('Failed to update online status:', error)
                  toast.error('Failed to update online status')
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-gray-50/50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-6">Privacy Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Profile Visibility</label>
              <p className="text-sm text-muted-foreground">
                Choose who can see your profile
              </p>
            </div>
            <select
              className="p-2 border rounded-md"
              value={formData.profileVisibility}
              onChange={(e) => setFormData(prev => ({ ...prev, profileVisibility: e.target.value }))}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="contacts">Contacts Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Data Sharing</label>
              <p className="text-sm text-muted-foreground">
                Allow sharing of your data with trusted partners
              </p>
            </div>
            <Switch
              checked={formData.dataSharing || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, dataSharing: checked }))}
            />
          </div>
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
} 