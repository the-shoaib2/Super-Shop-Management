import { Dialog } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { storeService } from '@/services/storeService'

export const StoreSettingsDialog = ({ isOpen, onClose, store, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: '',
    phone: '',
    email: '',
    active: false
  })

  useEffect(() => {
    if (store?.id) {
      loadStoreSettings(store.id)
    }
  }, [store?.id])

  const loadStoreSettings = async (storeId) => {
    try {
      setLoading(true)
      const response = await storeService.getStoreSettings(storeId)
      if (response.success) {
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          address: response.data.address || '',
          location: response.data.location || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          active: response.data.active || false
        })
      } else {
        toast.error('Failed to load store settings')
      }
    } catch (error) {
      console.error('Load settings error:', error)
      toast.error('Failed to load store settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await storeService.updateStore(store.id, formData)
      
      if (response.success) {
        toast.success('Store settings updated successfully')
        onUpdate(response.data)
        onClose()
      } else {
        toast.error(response.error || 'Failed to update store settings')
      }
    } catch (error) {
      console.error('Update store error:', error)
      toast.error('Failed to update store settings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStore = async () => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      const response = await storeService.deleteStore(store.id)
      
      if (response.success) {
        toast.success('Store deleted successfully')
        onClose()
        // Redirect or handle store deletion
        window.location.href = '/dashboard'
      } else {
        toast.error(response.error || 'Failed to delete store')
      }
    } catch (error) {
      console.error('Delete store error:', error)
      toast.error('Failed to delete store')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact' },
    { id: 'advanced', label: 'Advanced' }
  ]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Full-screen container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-card shadow-xl">
            <div className="flex h-[calc(100vh-8rem)] max-h-[600px]">
              {/* Sidebar */}
              <div className="w-40 bg-muted p-4 border-r border-border">
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Dialog.Title className="text-lg font-semibold text-foreground">
                    Store Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'general' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Store ID */}
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                              Store ID
                            </label>
                            <input
                              type="text"
                              value={store?.storeId || ''}
                              disabled
                              className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md"
                            />
                          </div>
                          {/* Active Status */}
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                              Status
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  active: e.target.checked
                                }))}
                                className="rounded border-input text-primary focus:ring-ring"
                              />
                              <span className="text-sm text-muted-foreground">Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Store Name */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Store Name
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              name: e.target.value
                            }))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              description: e.target.value
                            }))}
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'contact' && (
                      <div className="space-y-4">
                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Address
                          </label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              address: e.target.value
                            }))}
                            rows={2}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                              Phone
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                phone: e.target.value
                              }))}
                              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                              }))}
                              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'advanced' && (
                      <div className="space-y-4">
                        <div className="bg-destructive/10 rounded-lg p-4">
                          <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
                          <p className="text-sm text-destructive/80 mb-4">
                            Once you delete a store, there is no going back. Please be certain.
                          </p>
                          <button
                            type="button"
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                            onClick={handleDeleteStore}
                          >
                            Delete Store
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4 bg-muted">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
} 