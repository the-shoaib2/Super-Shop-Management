export function NotificationsSection({ formData, setFormData }) {
  return (
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
        </div>
      </div>
    </div>
  )
} 