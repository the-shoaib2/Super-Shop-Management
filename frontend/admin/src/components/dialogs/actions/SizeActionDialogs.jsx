import { useState } from 'react'
import { FiDroplet, FiHash, FiMaximize2 } from 'react-icons/fi'
import { BaseActionDialog } from './BaseActionDialog'
import { Button } from '@/components/ui/button'
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

// Add product type constants
const PRODUCT_TYPES = [
  'T-Shirts',
  'Shirts',
  'Pants',
  'Jeans',
  'Dresses',
  'Sweaters',
  'Jackets',
  'Accessories',
  'Shoes',
  'Bags',
  'Other'
]

export const SizePickerDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  size,
  newSize = {
    name: '',
    value: '',
    productType: '',
    dimensions: {
      chest: '',
      waist: '',
      hips: '',
      length: '',
      width: ''
    }
  },
  onSizeChange,
  isEdit = false 
}) => {
  const [sizeType, setSizeType] = useState('Clothing')

  const dimensions = newSize?.dimensions || {
    chest: '',
    waist: '',
    hips: '',
    length: '',
    width: ''
  }

  const handleSizeSelect = (suggestedSize) => {
    onSizeChange({
      name: suggestedSize.name,
      value: suggestedSize.value,
      dimensions: suggestedSize.dimensions
    })
  }

  return (
    <BaseActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isEdit ? 'Edit Size' : 'Add New Size'}
      confirmText={isEdit ? 'Update Size' : 'Add Size'}
      description={isEdit 
        ? 'Edit the size details below.' 
        : 'Add a new size by entering the details below.'
      }
    >
      <div className="space-y-6 py-4 max-h-[700px] overflow-y-auto">
        {/* Size Type Selector - Made more compact */}
        <div className="sticky top-0 bg-background z-10 pb-4 border-b">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap min-w-[70px]">Size Type:</label>
            <div className="flex-1 flex gap-1">
              {Object.keys(SUGGESTED_SIZES).map((type) => (
                <Button
                  key={type}
                  variant={sizeType === type ? "default" : "outline"}
                  onClick={() => setSizeType(type)}
                  className="flex-1 px-2"
                  size="sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Basic Info - Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Size Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={newSize.name}
                onChange={(e) => onSizeChange({ ...newSize, name: e.target.value })}
                placeholder="e.g., XL, UK 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Value</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={newSize.value}
                onChange={(e) => onSizeChange({ ...newSize, value: e.target.value })}
                placeholder="e.g., Extra Large, EU 44"
              />
            </div>
          </div>

          {/* Content Based on Size Type */}
          {sizeType === 'Custom' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left Column - Custom Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Type</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newSize.productType || ''}
                    onChange={(e) => onSizeChange({ ...newSize, productType: e.target.value })}
                  >
                    <option value="">Select Product Type</option>
                    {PRODUCT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Custom Dimensions</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={newSize.customLabel || ''}
                      onChange={(e) => onSizeChange({ ...newSize, customLabel: e.target.value })}
                      placeholder="Label (e.g., Shoulder)"
                    />
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={newSize.customValue || ''}
                      onChange={(e) => onSizeChange({ ...newSize, customValue: e.target.value })}
                      placeholder="Value (e.g., 16)"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Guide */}
              <div className="bg-muted p-4 rounded-lg h-fit">
                <h4 className="font-medium text-sm mb-2">Custom Size Guide</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Select a product type for better organization</li>
                  <li>• Add specific measurements for your product</li>
                  <li>• Use clear labels for dimensions</li>
                  <li>• Include measurement units (cm, inches, etc.)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left Column - Dimensions */}
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
                        value={dimensions.chest || ''}
                        onChange={(e) => onSizeChange({
                          ...newSize,
                          dimensions: { ...dimensions, chest: e.target.value }
                        })}
                        placeholder="Chest (inches)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={dimensions.waist || ''}
                        onChange={(e) => onSizeChange({
                          ...newSize,
                          dimensions: { ...dimensions, waist: e.target.value }
                        })}
                        placeholder="Waist (inches)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={dimensions.hips || ''}
                        onChange={(e) => onSizeChange({
                          ...newSize,
                          dimensions: { ...dimensions, hips: e.target.value }
                        })}
                        placeholder="Hips (inches)"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={dimensions.length || ''}
                        onChange={(e) => onSizeChange({
                          ...newSize,
                          dimensions: { ...dimensions, length: e.target.value }
                        })}
                        placeholder="Length (cm)"
                      />
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={dimensions.width || ''}
                        onChange={(e) => onSizeChange({
                          ...newSize,
                          dimensions: { ...dimensions, width: e.target.value }
                        })}
                        placeholder="Width (cm)"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - Suggested Sizes */}
              <div>
                <label className="block text-sm font-medium mb-2">Suggested Sizes</label>
                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
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
            </div>
          )}
        </div>
      </div>
    </BaseActionDialog>
  )
} 