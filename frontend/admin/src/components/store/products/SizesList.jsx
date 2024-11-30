import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { storeAPI } from '@/services/api'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { SizePickerDialog } from '@/components/dialogs/actions/SizeActionDialogs'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'

export default function SizesList() {
  const { currentStore } = useAuth()
  const [sizes, setSizes] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [newSize, setNewSize] = useState({
    name: '',
    value: '',
    productType: '',
    customLabel: '',
    customValue: '',
    dimensions: {
      chest: '',
      waist: '',
      hips: '',
      length: '',
      width: ''
    }
  })

  useEffect(() => {
    if (currentStore?.id) {
      fetchSizes()
    } else {
      setSizes([])
    }
  }, [currentStore])

  const fetchSizes = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getStoreSizes(currentStore.id)
      if (response.success) {
        setSizes(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch sizes:', error)
      toast.error('Failed to load sizes')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (size) => {
    setSelectedSize(size)
    setNewSize({
      name: size.name,
      value: size.value,
      productType: size.productType,
      customLabel: size.customLabel,
      customValue: size.customValue,
      dimensions: size.dimensions || {}
    })
    setShowAddDialog(true)
  }

  const handleDeleteClick = (size) => {
    setSelectedSize(size)
    setShowDeleteDialog(true)
  }

  const handleAddSize = async () => {
    try {
      if (!currentStore?.id) {
        toast.error('Please select a store first')
        return
      }

      if (!newSize.name.trim()) {
        toast.error('Please enter a size name')
        return
      }

      const sizeData = {
        name: newSize.name.trim(),
        value: newSize.value.trim()
      }

      let response;
      
      if (selectedSize) {
        // Update existing size
        response = await storeAPI.updateStoreSize(currentStore.id, selectedSize.id, sizeData)
      } else {
        // Create new size
        response = await storeAPI.addStoreSize(currentStore.id, sizeData)
      }

      if (response.success) {
        toast.success(`Size ${selectedSize ? 'updated' : 'added'} successfully`)
        setShowAddDialog(false)
        fetchSizes()
      } else {
        throw new Error(response.message || `Failed to ${selectedSize ? 'update' : 'add'} size`)
      }
    } catch (error) {
      console.error(`Failed to ${selectedSize ? 'update' : 'add'} size:`, error)
      toast.error(error.message || `Failed to ${selectedSize ? 'update' : 'add'} size`)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await storeAPI.deleteStoreSize(currentStore.id, selectedSize.id)
      toast.success('Size deleted successfully')
      fetchSizes()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete size:', error)
      toast.error('Failed to delete size')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ViewModeSelector 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          <Button 
            onClick={() => {
              setSelectedSize(null)
              setNewSize({
                name: '',
                value: '',
                productType: '',
                customLabel: '',
                customValue: '',
                dimensions: {
                  chest: '',
                  waist: '',
                  hips: '',
                  length: '',
                  width: ''
                }
              })
              setShowAddDialog(true)
            }}
            className="w-full sm:w-auto"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Size
          </Button>
        </div>
      </div>

      {viewMode === 'grid' && (
        <ProductViews.Sizes.Grid 
          items={sizes} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'list' && (
        <ProductViews.Sizes.List 
          items={sizes} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'details' && (
        <ProductViews.Sizes.Details 
          items={sizes} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {sizes.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sizes</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new size.</p>
          <div className="mt-6">
            <Button onClick={() => setShowAddDialog(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Size
            </Button>
          </div>
        </div>
      )}

      <SizePickerDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onConfirm={handleAddSize}
        size={selectedSize}
        newSize={newSize}
        onSizeChange={setNewSize}
        isEdit={!!selectedSize}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Size"
        itemName={selectedSize?.name}
        itemType="size"
      />
    </div>
  )
} 