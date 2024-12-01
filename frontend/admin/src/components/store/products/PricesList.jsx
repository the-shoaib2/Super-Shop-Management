import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { productAPI } from '@/services/api/store/productAPI'
import CreateProductDialog from '@/components/dialogs/product'

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

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await productAPI.getProducts(currentStore.id, {
        type: 'price'
      })
      
      if (response.success) {
        setPrices(response.data || [])
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      toast.error('Failed to load prices')
    } finally {
      setLoading(false)
    }
  }, [currentStore?.id])

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
      const response = await productAPI.deleteProduct(selectedPrice.id)
      if (response.success) {
        toast.success('Price deleted successfully')
        fetchPrices()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Failed to delete price:', error)
      toast.error('Failed to delete price')
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Handle dialog close and refresh
  const handleDialogClose = () => {
    setShowAddDialog(false)
    setSelectedPrice(null)
  }

  // Handle successful product creation
  const handleProductCreated = async () => {
    await fetchPrices() // Refresh the list
    handleDialogClose()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const ViewComponent = ProductViews.Prices[
    viewMode.charAt(0).toUpperCase() + viewMode.slice(1)
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">Prices</h2>

          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <ViewModeSelector 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
              className="w-full sm:w-auto"
            />
            <Button 
              onClick={() => {
                setSelectedPrice(null)
                setShowAddDialog(true)
              }}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Price
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {prices.length > 0 ? (
          <ViewComponent
            items={prices}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/50 px-6 py-10">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No prices</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new price.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="w-full sm:w-auto"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Price
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog Component */}
      <CreateProductDialog
        isOpen={showAddDialog}
        onClose={handleDialogClose}
        onSuccess={handleProductCreated}
        initialData={selectedPrice}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Price"
        itemName={selectedPrice?.name}
        itemType="price"
      />
    </div>
  )
} 