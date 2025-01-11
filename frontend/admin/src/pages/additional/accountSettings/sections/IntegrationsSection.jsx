import { Button } from '@/components/ui/button'

export function IntegrationsSection() {
  return (
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
        </div>
      </div>
    </div>
  )
} 