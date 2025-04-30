import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/auth-context'
import { BillboardPickerDialog } from '@/components/dialogs/actions/BillboardActionDialogs'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { storeAPI } from '@/services/api'

// Add temporary file storage utility
const createTempFileUrl = (file) => {
  return URL.createObjectURL(file)
}

export default function BillboardsList() {
  const { currentStore } = useAuth()
  const [billboards, setBillboards] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedBillboard, setSelectedBillboard] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [newBillboard, setNewBillboard] = useState({
    label: '',
    imageUrl: '',
    description: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [tempImageUrl, setTempImageUrl] = useState(null)

  useEffect(() => {
    if (currentStore?.id) {
      fetchBillboards()
    } else {
      setBillboards([])
    }
  }, [currentStore])

  const fetchBillboards = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getStoreBillboards(currentStore.id)
      if (response.success) {
        setBillboards(response.data || [])
      } else {
        throw new Error(response.message || 'Failed to fetch billboards')
      }
    } catch (error) {
      console.error('Failed to fetch billboards:', error)
      toast.error('Failed to load billboards')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBillboard = async (e) => {
    e.preventDefault()
    try {
      if (!newBillboard.imageUrl) {
        toast.error('Please select an image')
        return
      }

      if (!newBillboard.label.trim()) {
        toast.error('Please enter a label')
        return
      }

      const billboardData = {
        label: newBillboard.label.trim(),
        imageUrl: newBillboard.imageUrl,
        description: newBillboard.description.trim(),
        isActive: newBillboard.isActive
      }

      let response;
      if (selectedBillboard) {
        // Update existing billboard
        response = await storeAPI.updateStoreBillboard(
          currentStore.id, 
          selectedBillboard.id, 
          billboardData
        )
      } else {
        // Create new billboard
        response = await storeAPI.createStoreBillboard(
          currentStore.id, 
          billboardData
        )
      }

      if (response.success) {
        toast.success(`Billboard ${selectedBillboard ? 'updated' : 'added'} successfully`)
        setShowAddDialog(false)
        fetchBillboards()
        resetForm()
      } else {
        throw new Error(response.message || `Failed to ${selectedBillboard ? 'update' : 'add'} billboard`)
      }
    } catch (error) {
      console.error('Failed to handle billboard:', error)
      toast.error(error.message || 'Failed to process billboard')
    }
  }

  const resetForm = () => {
    setNewBillboard({
      label: '',
      imageUrl: '',
      description: '',
      isActive: true
    })
    setSelectedImage(null)
    setSelectedBillboard(null)
  }

  const handleImageSelect = (file) => {
    // Cleanup previous temporary file if exists
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl)
    }

    // Create new temporary file URL
    const newTempUrl = createTempFileUrl(file)
    setTempImageUrl(newTempUrl)
    setSelectedImage(file)
    setNewBillboard(prev => ({
      ...prev,
      imageUrl: newTempUrl
    }))
  }

  const handleEditClick = (billboard) => {
    setSelectedBillboard(billboard)
    setNewBillboard({
      label: billboard.label,
      imageUrl: billboard.imageUrl,
      description: billboard.description,
      isActive: billboard.isActive
    })
    setShowAddDialog(true)
  }

  const handleDeleteClick = (billboard) => {
    setSelectedBillboard(billboard)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await storeAPI.deleteStoreBillboard(
        currentStore.id, 
        selectedBillboard.id
      )
      
      if (response.success) {
        toast.success('Billboard deleted successfully')
        fetchBillboards()
        setShowDeleteDialog(false)
      } else {
        throw new Error(response.message || 'Failed to delete billboard')
      }
    } catch (error) {
      console.error('Failed to delete billboard:', error)
      toast.error(error.message || 'Failed to delete billboard')
    }
  }

  // Cleanup temporary files on unmount
  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
      }
    }
  }, [tempImageUrl])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const ViewComponent = ProductViews.Billboards[
    viewMode.charAt(0).toUpperCase() + viewMode.slice(1)
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">Billboards</h2>

          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <ViewModeSelector 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
              className="w-full sm:w-auto"
            />
            <Button 
              onClick={() => {
                setSelectedBillboard(null)
                setNewBillboard({
                  label: '',
                  imageUrl: '',
                  description: '',
                  isActive: true
                })
                setShowAddDialog(true)
              }}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Billboard
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {billboards.length > 0 ? (
          <ViewComponent
            items={billboards}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/50 px-6 py-10">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No billboards</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new billboard.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="w-full sm:w-auto"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Billboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BillboardPickerDialog
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false)
          setSelectedBillboard(null)
          setNewBillboard({
            label: '',
            imageUrl: '',
            description: '',
            isActive: true
          })
          setSelectedImage(null)
        }}
        onConfirm={handleAddBillboard}
        billboard={selectedBillboard}
        newBillboard={newBillboard}
        onBillboardChange={setNewBillboard}
        isEdit={!!selectedBillboard}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Billboard"
        itemName={selectedBillboard?.label}
        itemType="billboard"
      />
    </div>
  )
} 