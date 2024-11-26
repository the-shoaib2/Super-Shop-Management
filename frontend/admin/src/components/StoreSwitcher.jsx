import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { FiPlus, FiChevronDown } from 'react-icons/fi'
import CreateStoreDialog from './dialogs/CreateStoreDialog'
import { storeAPI } from '@/services/api'
import { toast } from 'react-hot-toast'

const truncateText = (text, maxLength) => {
  return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function StoreSwitcher() {
  const { user, currentStore, setCurrentStore } = useAuth()
  const [showStoreDialog, setShowStoreDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getOwnerStores()
      
      if (response.success && response.data) {
        const validStores = response.data.filter(store => 
          store && store.id && store.name
        )
        
        setStores(validStores)
        
        if (!currentStore && validStores.length > 0) {
          setCurrentStore(validStores[0])
        }
      } else {
        console.error('Failed to fetch stores:', response.error)
        toast.error(response.error || 'Failed to load stores')
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error)
      toast.error(error.response?.data?.message || 'Failed to load stores')
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSwitch = async (store) => {
    try {
      const response = await storeAPI.switchStore(store.id)
      if (response.success) {
        setCurrentStore(store)
        setShowStoreDialog(false)
        toast.success(`Switched to ${store.name}`)
      } else {
        throw new Error(response.message || 'Failed to switch store')
      }
    } catch (error) {
      console.error('Failed to switch store:', error)
      toast.error(error.response?.data?.message || 'Failed to switch store')
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-[200px] justify-between"
          onClick={() => setShowStoreDialog(true)}
          disabled={loading}
        >
          <div className="flex flex-col items-start">
            <span className="text-sm">
              {loading ? 'Loading...' : truncateText(currentStore?.name, 10) || 'Select Store'}
            </span>
            {currentStore?.category && (
              <span className="text-xs text-muted-foreground">
                {truncateText(currentStore.category, 15)}
              </span>
            )}
          </div>
          <FiChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCreateDialog(true)}
        >
          <FiPlus className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Switch Store</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {stores.map((store) => (
              <Button
                key={store.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleStoreSwitch(store)}
              >
                <div className="flex flex-col items-start">
                  <span title={store.name}>{truncateText(store.name, 20)}</span>
                  {store.category && (
                    <span className="text-xs text-muted-foreground" title={store.category}>
                      {truncateText(store.category, 25)}
                    </span>
                  )}
                </div>
              </Button>
            ))}
            {stores.length === 0 && !loading && (
              <p className="text-center text-muted-foreground py-4">
                No stores found. Create one to get started.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateStoreDialog 
        open={showCreateDialog} 
        onClose={() => {
          setShowCreateDialog(false)
          fetchStores() // Refresh stores list after creation
        }}
      />
    </>
  )
} 