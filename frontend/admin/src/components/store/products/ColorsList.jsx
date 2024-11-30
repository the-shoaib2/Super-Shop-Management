import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiDroplet, FiHash } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"
import { storeAPI } from '@/services/api'

const PRESET_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' }
]

export default function ColorsList() {
  const { currentStore } = useAuth()
  const [colors, setColors] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newColor, setNewColor] = useState({
    name: '',
    hex: '#000000',
    value: '#000000'
  })

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

  const ColorPickerDialog = ({ open, onClose }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {selectedColor ? 'Edit Color' : 'Add New Color'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Color Preview */}
          <div className="flex justify-center">
            <div 
              className="w-32 h-32 rounded-full border-4 shadow-inner"
              style={{ 
                backgroundColor: newColor.hex,
                borderColor: newColor.hex 
              }}
            />
          </div>

          {/* Color Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Color Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDroplet className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 p-2 border rounded-md"
                  value={newColor.name}
                  onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                  placeholder="e.g., Royal Blue"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHash className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 p-2 border rounded-md"
                    value={newColor.hex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="000000"
                  />
                </div>
                <div className="relative">
                  <input
                    type="color"
                    value={newColor.value}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="sr-only"
                    id="color-picker"
                  />
                  <label
                    htmlFor="color-picker"
                    className="w-10 h-10 rounded-md border-2 cursor-pointer overflow-hidden flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ 
                      backgroundColor: newColor.hex,
                      borderColor: newColor.hex === '#FFFFFF' ? '#e2e8f0' : newColor.hex 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20" />
                    <FiDroplet 
                      className={`h-5 w-5 ${
                        isLightColor(newColor.hex) ? 'text-gray-800' : 'text-white'
                      }`} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">Preset Colors</label>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorChange(color.hex)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200",
                    newColor.hex === color.hex ? "scale-110 shadow-lg" : "hover:scale-105"
                  )}
                  style={{ 
                    backgroundColor: color.hex,
                    borderColor: color.hex === '#FFFFFF' ? '#e2e8f0' : color.hex
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleAddColor}
              disabled={!newColor.name || !newColor.hex}
            >
              <FiCheck className="mr-2 h-4 w-4" />
              {selectedColor ? 'Update Color' : 'Add Color'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

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
        value: newColor.hex,
        storeId: currentStore.id
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Colors</h2>
        <Button 
          onClick={() => {
            setSelectedColor(null)
            setNewColor({ name: '', hex: '#000000', value: '#000000' })
            setShowAddDialog(true)
          }}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Color
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-full border shadow-inner"
                style={{ backgroundColor: color.value }}
              />
              <div className="flex-1">
                <h3 className="font-medium">{color.name}</h3>
                <p className="text-sm text-gray-500">{color.value}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedColor(color)
                    setNewColor({
                      name: color.name,
                      hex: color.value,
                      value: color.value
                    })
                    setShowAddDialog(true)
                  }}
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteColor(color.id)}
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {colors.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No colors found. Add some colors to get started.
          </div>
        )}
      </div>

      <ColorPickerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  )
} 