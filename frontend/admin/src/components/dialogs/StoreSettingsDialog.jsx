import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { storeAPI } from '@/services/api'
import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton
} from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'
import { FiCopy, FiCheck } from 'react-icons/fi'

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
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (store && isOpen) {
      setFormData({
        name: store.name || '',
        description: store.description || '',
        address: store.address || '',
        location: store.location || '',
        phone: store.phone || '',
        email: store.email || '',
        active: store.active || false
      })
      if (store.id) {
        loadStoreSettings(store.id)
      }
    }
  }, [store, isOpen])

  const loadStoreSettings = async (storeId) => {
    try {
      setLoading(true)
      const response = await storeAPI.getStoreSettings(storeId)
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          ...response.data,
          name: response.data.name || store.name || '',
          description: response.data.description || store.description || '',
          active: response.data.active ?? store.active ?? false
        }))
      } else {
        console.error('Failed to load store settings:', response.error)
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
    if (!formData.name.trim()) {
      toast.error('Store name is required')
      return
    }

    try {
      setLoading(true)
      const response = await storeAPI.updateStore(store.id, {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      })
      
      if (response.success) {
        toast.success('Store settings updated successfully')
        onUpdate({
          ...store,
          ...response.data,
          name: response.data.name || formData.name,
          description: response.data.description || formData.description
        })
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
      const response = await storeAPI.deleteStore(store.id)
      
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

  const handleCopyStoreId = async () => {
    try {
      await navigator.clipboard.writeText(store?.storeId || '')
      setCopySuccess(true)
      toast.success('Store ID copied to clipboard')
      
      // Reset copy success after 2 seconds
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy Store ID')
    }
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'contact', label: 'Contact' },
    { id: 'advanced', label: 'Advanced' }
  ]

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
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
          <DialogHeader>
            <DialogTitle>
              {loading ? 'Loading...' : `Store Settings - ${formData.name || 'Unnamed Store'}`}
            </DialogTitle>
            <DialogCloseButton onClose={onClose} />
          </DialogHeader>

          {/* Form Content - Scrollable */}
          <DialogContent className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Store ID with Copy Button */}
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Store ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={store?.storeId || ''}
                          disabled
                          className="w-full px-3 py-2 bg-muted text-muted-foreground rounded-md pr-10"
                        />
                        <button
                          type="button"
                          onClick={handleCopyStoreId}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                            copySuccess 
                              ? 'text-green-500 hover:text-green-600 bg-green-50' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
                          }`}
                        >
                          {copySuccess ? (
                            <FiCheck className="h-4 w-4" />
                          ) : (
                            <FiCopy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
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
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter store name"
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
                      placeholder="Enter store description"
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
          </DialogContent>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </div>
      </div>
    </AnimatedDialog>
  )
} 