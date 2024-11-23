import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiMaximize2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"

const SUGGESTED_SIZES = {
  Clothing: [
    { name: 'XS', value: 'Extra Small', dimensions: { chest: '32-34', waist: '26-28', hips: '34-36' } },
    { name: 'S', value: 'Small', dimensions: { chest: '34-36', waist: '28-30', hips: '36-38' } },
    { name: 'M', value: 'Medium', dimensions: { chest: '36-38', waist: '30-32', hips: '38-40' } },
    { name: 'L', value: 'Large', dimensions: { chest: '38-40', waist: '32-34', hips: '40-42' } },
    { name: 'XL', value: 'Extra Large', dimensions: { chest: '40-42', waist: '34-36', hips: '42-44' } },
    { name: '2XL', value: '2X Large', dimensions: { chest: '42-44', waist: '36-38', hips: '44-46' } },
    { name: '3XL', value: '3X Large', dimensions: { chest: '44-46', waist: '38-40', hips: '46-48' } }
  ],
  Shoes: [
    { name: 'UK 6', value: 'EU 39', dimensions: { length: '24.5cm', width: '9.5cm' } },
    { name: 'UK 7', value: 'EU 40', dimensions: { length: '25.1cm', width: '9.7cm' } },
    { name: 'UK 8', value: 'EU 41', dimensions: { length: '25.7cm', width: '9.9cm' } },
    { name: 'UK 9', value: 'EU 42', dimensions: { length: '26.3cm', width: '10.1cm' } },
    { name: 'UK 10', value: 'EU 43', dimensions: { length: '26.9cm', width: '10.3cm' } }
  ],
  Custom: []
}

export default function SizesList() {
  const { currentStore } = useAuth()
  const [sizes, setSizes] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sizeType, setSizeType] = useState('Clothing')
  const [newSize, setNewSize] = useState({
    name: '',
    value: '',
    dimensions: {
      chest: '',
      waist: '',
      hips: '',
      length: '',
      width: ''
    }
  })

  const handleSizeSelect = (suggestedSize) => {
    setNewSize({
      name: suggestedSize.name,
      value: suggestedSize.value,
      dimensions: suggestedSize.dimensions
    })
  }

  const SizePickerDialog = ({ open, onClose }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {selectedSize ? 'Edit Size' : 'Add New Size'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Size Type Selector - Made more compact */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">Size Type:</label>
            <div className="flex-1 flex gap-2">
              {Object.keys(SUGGESTED_SIZES).map((type) => (
                <Button
                  key={type}
                  variant={sizeType === type ? "default" : "outline"}
                  onClick={() => setSizeType(type)}
                  className="flex-1"
                  size="sm" // Made buttons smaller
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Two Column Layout for Main Content */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Size Input Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Size Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSize.name}
                    onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                    placeholder="e.g., XL, UK 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Value</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={newSize.value}
                    onChange={(e) => setNewSize({ ...newSize, value: e.target.value })}
                    placeholder="e.g., Extra Large, EU 44"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FiMaximize2 className="inline-block mr-1" />
                  Dimensions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {sizeType === 'Clothing' ? (
                    <>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSize.dimensions.chest}
                        onChange={(e) => setNewSize({
                          ...newSize,
                          dimensions: { ...newSize.dimensions, chest: e.target.value }
                        })}
                        placeholder="Chest (inches)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSize.dimensions.waist}
                        onChange={(e) => setNewSize({
                          ...newSize,
                          dimensions: { ...newSize.dimensions, waist: e.target.value }
                        })}
                        placeholder="Waist (inches)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md col-span-2"
                        value={newSize.dimensions.hips}
                        onChange={(e) => setNewSize({
                          ...newSize,
                          dimensions: { ...newSize.dimensions, hips: e.target.value }
                        })}
                        placeholder="Hips (inches)"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSize.dimensions.length}
                        onChange={(e) => setNewSize({
                          ...newSize,
                          dimensions: { ...newSize.dimensions, length: e.target.value }
                        })}
                        placeholder="Length (cm)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newSize.dimensions.width}
                        onChange={(e) => setNewSize({
                          ...newSize,
                          dimensions: { ...newSize.dimensions, width: e.target.value }
                        })}
                        placeholder="Width (cm)"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Suggested Sizes */}
            <div>
              {sizeType !== 'Custom' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Suggested Sizes</label>
                  <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto p-2 border rounded-md">
                    {SUGGESTED_SIZES[sizeType].map((suggestedSize) => (
                      <Button
                        key={suggestedSize.name}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "text-sm py-1",
                          newSize.name === suggestedSize.name && "border-primary bg-primary/10"
                        )}
                        onClick={() => handleSizeSelect(suggestedSize)}
                      >
                        {suggestedSize.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleAddSize}
              disabled={!newSize.name || !newSize.value}
              size="sm"
            >
              <FiCheck className="mr-2 h-4 w-4" />
              {selectedSize ? 'Update Size' : 'Add Size'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const handleAddSize = async () => {
    try {
      if (!newSize.name.trim()) {
        toast.error('Please enter a size name')
        return
      }

      // API call to add/update size
      const response = await storeAPI.addStoreSize({
        name: newSize.name.trim(),
        value: newSize.value.trim(),
        dimensions: newSize.dimensions,
        storeId: currentStore.id
      })

      if (response.success) {
        toast.success(`Size ${selectedSize ? 'updated' : 'added'} successfully`)
        setShowAddDialog(false)
        fetchSizes()
      }
    } catch (error) {
      console.error('Failed to add size:', error)
      toast.error('Failed to add size')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <Button 
          onClick={() => {
            setSelectedSize(null)
            setNewSize({
              name: '',
              value: '',
              dimensions: { chest: '', waist: '', hips: '', length: '', width: '' }
            })
            setShowAddDialog(true)
          }}
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Size
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sizes.map((size) => (
          <div
            key={size.id}
            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{size.name}</h3>
                <p className="text-sm text-gray-500">{size.value}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedSize(size)
                    setNewSize({
                      name: size.name,
                      value: size.value,
                      dimensions: size.dimensions
                    })
                    setShowAddDialog(true)
                  }}
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSize(size.id)}
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {size.dimensions && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-gray-500">Dimensions:</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(size.dimensions).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {sizes.length === 0 && !loading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No sizes found. Add some sizes to get started.
          </div>
        )}
      </div>

      <SizePickerDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  )
} 