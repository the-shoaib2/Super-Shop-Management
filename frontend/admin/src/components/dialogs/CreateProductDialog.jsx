import { useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { storeAPI } from '@/services/api'
import { toast } from 'react-hot-toast'
import { FiUpload, FiX } from 'react-icons/fi'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Pants',
  'Jeans',
  'Dresses',
  'Sweaters',
  'Jackets',
  'Accessories',
  'Shoes',
  'Bags'
]
const COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Brown', hex: '#A52A2A' }
]

export default function CreateProductDialog({ open, onClose }) {
  const { currentStore } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    salePrice: '',
    category: '',
    sizes: [],
    colors: [],
    stock: '',
    images: [],
    specifications: [{ key: '', value: '' }],
    variants: []
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, file]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color.name)
        ? prev.colors.filter(c => c !== color.name)
        : [...prev.colors, color.name]
    }))
  }

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }))
  }

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }))
  }

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }))
  }

  const generateVariants = () => {
    const variants = []
    formData.sizes.forEach(size => {
      formData.colors.forEach(color => {
        variants.push({
          size,
          color,
          price: formData.basePrice,
          stock: formData.stock
        })
      })
    })
    setFormData(prev => ({ ...prev, variants }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const productData = {
        ...formData,
        storeId: currentStore.id
      }
      await storeAPI.createProduct(productData)
      toast.success('Product created successfully')
      onClose()
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p className="text-sm text-gray-500">Enter the basic details of your product</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your product"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Price</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={formData.basePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sale Price (Optional)</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Variants & Options</h3>
        <p className="text-sm text-gray-500">Select available sizes and colors</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Available Sizes</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                formData.sizes.includes(size)
                  ? 'bg-primary text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Available Colors</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => handleColorToggle(color)}
              className={`p-2 rounded-md border flex items-center space-x-2 transition-colors ${
                formData.colors.includes(color.name)
                  ? 'bg-gray-100'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Initial Stock</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md"
          value={formData.stock}
          onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
          placeholder="Enter initial stock quantity"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Images & Specifications</h3>
        <p className="text-sm text-gray-500">Add product images and specifications</p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-4">
        <div className="text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label className="cursor-pointer">
              <span className="mt-2 block text-sm text-gray-600">
                Click to upload product images
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
            </label>
          </div>
        </div>
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Specifications</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecification}
          >
            Add Specification
          </Button>
        </div>
        <div className="space-y-2">
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                placeholder="Key"
                value={spec.key}
                onChange={(e) => updateSpecification(index, 'key', e.target.value)}
              />
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpecification(index)}
              >
                <FiX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <div className="p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 relative ${
                  stepNumber < 3 ? 'after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-gray-200 after:top-4 after:left-1/2' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    step >= stepNumber
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1)
              } else {
                handleSubmit()
              }
            }}
            disabled={loading}
          >
            {step === 3 ? (loading ? 'Creating...' : 'Create Product') : 'Next'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
} 