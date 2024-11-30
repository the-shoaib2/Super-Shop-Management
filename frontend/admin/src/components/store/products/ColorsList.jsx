import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiDroplet, FiHash, FiGrid, FiList, FiSquare } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"
import { storeAPI } from '@/services/api'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { EditColorDialog } from '@/components/dialogs/actions/ColorActionDialogs'
import { ColorPickerDialog } from '@/components/dialogs/actions/ColorPickerDialog'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'

export default function ColorsList() {
  const { currentStore } = useAuth()
  const [colors, setColors] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showColorDialog, setShowColorDialog] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newColor, setNewColor] = useState({
    name: '',
    hex: '#000000',
    value: '#000000'
  })
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', or 'details'

  useEffect(() => {
    if (currentStore?.id) {
      fetchColors()
    } else {
      setColors([])
    }
  }, [currentStore])

  const fetchColors = async () => {
    try {
      if (!currentStore?.id) {
        setColors([])
        return
      }

      setLoading(true)
      const response = await storeAPI.getStoreColors(currentStore.id)
      if (response.success) {
        setColors(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch colors:', error)
      toast.error('Failed to load colors')
    } finally {
      setLoading(false)
    }
  }

  const handleColorChange = (hex) => {
    setNewColor(prev => ({
      ...prev,
      hex,
      value: hex
    }))
  }

  const handleEditClick = (color) => {
    setSelectedColor(color)
    setNewColor({
      name: color.name,
      hex: color.value,
      value: color.value
    })
    setShowColorDialog(true)
  }

  const handleDeleteClick = (color) => {
    setSelectedColor(color)
    setShowDeleteDialog(true)
  }

  const handleColorDialogClose = () => {
    setShowColorDialog(false)
    setSelectedColor(null)
    setNewColor({
      name: '',
      hex: '#000000',
      value: '#000000'
    })
  }

  const handleColorDialogConfirm = async () => {
    try {
      await handleAddColor()
      handleColorDialogClose()
    } catch (error) {
      // Error is already handled in handleAddColor
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await handleDeleteColor(selectedColor.id)
      setShowDeleteDialog(false)
    } catch (error) {
      // Error is already handled in handleDeleteColor
    }
  }

  const handleAddColor = async () => {
    try {
      if (!currentStore?.id) {
        toast.error('Please select a store first')
        return
      }

      if (!newColor.name.trim()) {
        toast.error('Please enter a color name')
        return
      }

      const colorData = {
        name: newColor.name.trim(),
        value: newColor.hex
      }

      const response = await storeAPI.addStoreColor(currentStore.id, colorData)

      if (response.success) {
        toast.success(`Color ${selectedColor ? 'updated' : 'added'} successfully`)
        setShowAddDialog(false)
        fetchColors()
      } else {
        throw new Error(response.message || 'Failed to add color')
      }
    } catch (error) {
      console.error('Failed to add color:', error)
      toast.error(error.message || 'Failed to add color')
    }
  }

  const handleDeleteColor = async (colorId) => {
    try {
      await storeAPI.deleteStoreColor(currentStore.id, colorId)
      toast.success('Color deleted successfully')
      fetchColors()
    } catch (error) {
      console.error('Failed to delete color:', error)
      toast.error('Failed to delete color')
    }
  }

  const isLightColor = (hex) => {
    const c = hex.substring(1)  // strip #
    const rgb = parseInt(c, 16)   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff  // extract red
    const g = (rgb >>  8) & 0xff  // extract green
    const b = (rgb >>  0) & 0xff  // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709

    return luma > 128
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Colors</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <ViewModeSelector 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          <Button 
            onClick={() => {
              setSelectedColor(null)
              setNewColor({ name: '', hex: '#000000', value: '#000000' })
              setShowAddDialog(true)
            }}
            className="w-full sm:w-auto"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Color
          </Button>
        </div>
      </div>

      {/* Render appropriate view based on viewMode */}
      {viewMode === 'grid' && (
        <ProductViews.Colors.Grid 
          items={colors} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'list' && (
        <ProductViews.Colors.List 
          items={colors} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}
      {viewMode === 'details' && (
        <ProductViews.Colors.Details 
          items={colors} 
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      {colors.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <FiDroplet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No colors</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new color.</p>
          <div className="mt-6">
            <Button onClick={() => setShowAddDialog(true)}>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </div>
        </div>
      )}

      <ColorPickerDialog
        isOpen={showColorDialog}
        onClose={handleColorDialogClose}
        onConfirm={handleColorDialogConfirm}
        color={selectedColor}
        newColor={newColor}
        onColorChange={setNewColor}
        isLightColor={isLightColor}
        isEdit={!!selectedColor}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Color"
        itemName={selectedColor?.name}
        itemType="color"
      />
    </div>
  )
} 