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
import { FiCopy, FiCheck, FiDownload, FiAlertTriangle, FiLoader } from 'react-icons/fi'

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
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloaded, setHasDownloaded] = useState(false)

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

  const handleDownloadData = async () => {
    try {
      setIsDownloading(true)
      // API call to get store data
      const response = await storeAPI.getStoreData(store.id)
      
      if (response.success) {
        // Create a blob from the data
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `store-${store.id}-backup.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setHasDownloaded(true)
        toast.success('Store data downloaded successfully')
      } else {
        throw new Error(response.error || 'Failed to download store data')
      }
    } catch (error) {
      console.error('Download store data error:', error)
      toast.error('Failed to download store data')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDeleteStore = async () => {
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
      setShowDeleteWarning(false)
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

  // Delete Warning Dialog
  const DeleteWarningDialog = () => {
    const [preparingData, setPreparingData] = useState(false)
    const [dataReady, setDataReady] = useState(false)
    const [downloadStarted, setDownloadStarted] = useState(false)

    const prepareAndDownloadData = async () => {
      try {
        setPreparingData(true)
        
        // Simulate data preparation time (remove in production)
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const response = await storeAPI.getStoreData(store.id)
        
        if (response.success) {
          setDataReady(true)
          // Create a blob from the data
          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `store-${store.id}-backup.json`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          setDownloadStarted(true)
          toast.success('Store data downloaded successfully')
        } else {
          throw new Error(response.error || 'Failed to prepare store data')
        }
      } catch (error) {
        console.error('Prepare store data error:', error)
        toast.error('Failed to prepare store data')
      } finally {
        setPreparingData(false)
      }
    }

    return (
      <AnimatedDialog
        isOpen={showDeleteWarning}
        onClose={() => !preparingData && setShowDeleteWarning(false)}
        maxWidth="max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5" />
            Delete Store
          </DialogTitle>
          {!preparingData && (
            <DialogCloseButton onClose={() => setShowDeleteWarning(false)} />
          )}
        </DialogHeader>

        <DialogContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Before deleting this store, we recommend downloading your store data for backup purposes.
            </p>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Store Details:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><span className="font-medium">Name:</span> {formData.name}</li>
                <li><span className="font-medium">ID:</span> {store?.storeId}</li>
                <li><span className="font-medium">Status:</span> {formData.active ? 'Active' : 'Inactive'}</li>
              </ul>
            </div>

            {preparingData ? (
              <div className="flex flex-col items-center py-4 text-sm text-muted-foreground">
                <FiLoader className="h-8 w-8 animate-spin mb-2" />
                <p>Preparing store data for download...</p>
                <p className="text-xs">This may take a minute</p>
              </div>
            ) : downloadStarted ? (
              <div className="flex flex-col items-center py-4 space-y-4">
                <div className="flex items-center text-green-500 gap-2">
                  <FiCheck className="h-5 w-5" />
                  <span className="text-sm">Data downloaded successfully</span>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteStore}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Deleting...' : 'Confirm Delete Store'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prepareAndDownloadData}
                  className="w-full"
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  Download Store Data
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted-foreground/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteStore}
                  className="w-full"
                >
                  Delete Without Downloading
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </AnimatedDialog>
    )
  }

  return (
    <>
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
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setShowDeleteWarning(true)}
                      >
                        Delete Store
                      </Button>
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

      {/* Delete Warning Dialog */}
      {showDeleteWarning && <DeleteWarningDialog />}
    </>
  )
} 