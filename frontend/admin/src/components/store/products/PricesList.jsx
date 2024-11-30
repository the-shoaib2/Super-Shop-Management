import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { storeAPI } from '@/services/api'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'

export default function PricesList() {
  const { currentStore } = useAuth()
  const [prices, setPrices] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    if (currentStore?.id) {
      fetchPrices()
    } else {
      setPrices([])
    }
  }, [currentStore])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getStorePrices(currentStore.id)
      if (response.success) {
        setPrices(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      toast.error('Failed to load prices')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (price) => {
    setSelectedPrice(price)
    setShowAddDialog(true)
  }

  const handleDeleteClick = (price) => {
    setSelectedPrice(price)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await storeAPI.deleteStorePrice(currentStore.id, selectedPrice.id)
      toast.success('Price range deleted successfully')
      fetchPrices()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete price range:', error)
      toast.error('Failed to delete price range')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Price Ranges</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ViewModeSelector 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          <Button 
            onClick={() => {
              setSelectedPrice(null)
              setShowAddDialog(true)
            }}
            className="w-full sm:w-auto"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Price Range
          </Button>
        </div>
      </div>

      {viewMode === 'grid' && (
        <ProductViews.Prices.Grid 
          items={prices} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'list' && (
        <ProductViews.Prices.List 
          items={prices} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'details' && (
        <ProductViews.Prices.Details 
          items={prices} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {/* Empty State */}
      {prices.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No price ranges</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new price range.</p>
          <div className="mt-6">
            <Button onClick={() => setShowAddDialog(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Price Range
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Price Range"
        itemName={selectedPrice?.name}
        itemType="price range"
      />

      {/* Add/Edit Dialog Component */}
      {/* ... Your existing dialog component ... */}
    </div>
  )
} 