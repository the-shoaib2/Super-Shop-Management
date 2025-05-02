import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { storeAPI } from '@/services/api'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  Loader,
  Settings,
  Trash2
} from 'lucide-react'

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
      const response = await storeAPI.getStoreData(store.id)
      
      if (response.success) {
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
      
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy Store ID')
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl h-[calc(100vh-8rem)] max-h-[600px] p-0">
          <div className="flex flex-col md:flex-row h-full">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden md:block w-40 bg-muted p-4 border-r border-border">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'general' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'contact' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  Contact
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'advanced' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>
                  {loading ? 'Loading...' : `Store Settings - ${formData.name || 'Unnamed Store'}`}
                </DialogTitle>
              </DialogHeader>

              {/* Mobile Tabs */}
              <div className="md:hidden border-b border-border">
                <div className="flex px-6 pt-4">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'general' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'contact' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    Contact
                  </button>
                  <button
                    onClick={() => setActiveTab('advanced')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'advanced' 
                        ? 'text-primary border-b-2 border-primary' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {activeTab === 'general' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Store ID with Copy Button */}
                        <div>
                          <Label>Store ID</Label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={store?.storeId || ''}
                              disabled
                              className="pr-10"
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
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Active Status */}
                        <div>
                          <Label>Status</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="active-status"
                              checked={formData.active}
                              onCheckedChange={(checked) => setFormData(prev => ({
                                ...prev,
                                active: checked
                              }))}
                            />
                            <Label htmlFor="active-status" className="text-sm">
                              Active
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Store Name */}
                      <div>
                        <Label>Store Name *</Label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          placeholder="Enter store name"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          rows={3}
                          placeholder="Enter store description"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="space-y-4">
                      {/* Address */}
                      <div>
                        <Label>Address</Label>
                        <Textarea
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div>
                          <Label>Phone</Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              email: e.target.value
                            }))}
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
                          className="w-full md:w-auto"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Store
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <DialogFooter className="px-6 py-4 border-t border-border">
                <DialogClose asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Warning Dialog */}
      <Dialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Store
            </DialogTitle>
          </DialogHeader>
          
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

            {isDownloading ? (
              <div className="flex flex-col items-center py-4 text-sm text-muted-foreground">
                <Loader className="h-8 w-8 animate-spin mb-2" />
                <p>Preparing store data for download...</p>
                <p className="text-xs">This may take a minute</p>
              </div>
            ) : hasDownloaded ? (
              <div className="flex flex-col items-center py-4 space-y-4">
                <div className="flex items-center text-green-500 gap-2">
                  <Check className="h-5 w-5" />
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
                  onClick={handleDownloadData}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
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
      </Dialog>
    </>
  )
} 