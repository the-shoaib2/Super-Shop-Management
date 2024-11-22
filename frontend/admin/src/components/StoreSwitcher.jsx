import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { FiPlus, FiChevronDown } from 'react-icons/fi'
import CreateStoreDialog from './dialogs/CreateStoreDialog'

export default function StoreSwitcher() {
  const { stores = [], currentStore, switchStore } = useAuth()
  const [showStoreDialog, setShowStoreDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Ensure stores is an array
  const storesList = Array.isArray(stores) ? stores : []

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-[200px] justify-between"
          onClick={() => setShowStoreDialog(true)}
        >
          <div className="flex flex-col items-start">
            <span className="text-sm">{currentStore?.name || 'Select Store'}</span>
            {currentStore?.category && (
              <span className="text-xs text-muted-foreground">
                {currentStore.category}
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

      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog} className="transition-opacity duration-300 ease-in-out">
        <DialogContent className="transition-transform transform duration-300 ease-in-out">
          <DialogHeader>
            <DialogTitle>Switch Store</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {storesList.map((store) => (
              <Button
                key={store.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  switchStore(store)
                  setShowStoreDialog(false)
                }}
              >
                <div className="flex flex-col items-start">
                  <span>{store.name}</span>
                  {store.category && (
                    <span className="text-xs text-muted-foreground">
                      {store.category}
                    </span>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <CreateStoreDialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
      />
    </>
  )
} 