import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { productAPI } from '@/services/api'
import { toast } from 'react-hot-toast'

const PRODUCT_CATEGORIES = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Electronics',
  'Home',
  'Beauty',
  'Sports'
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White']

export default function CreateProductDialog({ open, onClose }) {
  const { currentStore } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    status: 'draft',
    images: [],
    colors: [],
    sizes: [],
    variants: [],
    billboardText: '',
    billboardImage: '',
    features: [],
    specifications: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentStore?.id) {
      toast.error('No store selected')
      return
    }

    try {
      setLoading(true)
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        storeId: currentStore.id
      }

      await productAPI.createProduct(productData)
      toast.success('Product created successfully')
      onClose()
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // Handle image upload logic here
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: '', color: '', stock: 0, price: formData.price }
      ]
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                required
                className="w-full p-2 border rounded-md"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full p-2 border rounded-md"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare at Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded-md"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full p-2 border rounded-md"
              onChange={handleImageUpload}
            />
          </div>

          {/* Colors and Sizes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Colors</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(color => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={(e) => {
                        const newColors = e.target.checked
                          ? [...formData.colors, color]
                          : formData.colors.filter(c => c !== color)
                        setFormData({ ...formData, colors: newColors })
                      }}
                      className="mr-1"
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={(e) => {
                        const newSizes = e.target.checked
                          ? [...formData.sizes, size]
                          : formData.sizes.filter(s => s !== size)
                        setFormData({ ...formData, sizes: newSizes })
                      }}
                      className="mr-1"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Billboard */}
          <div>
            <label className="block text-sm font-medium mb-1">Billboard Text</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={formData.billboardText}
              onChange={(e) => setFormData({ ...formData, billboardText: e.target.value })}
            />
          </div>

          {/* Variants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Variants</label>
              <Button type="button" onClick={addVariant} size="sm">
                Add Variant
              </Button>
            </div>
            {formData.variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <select
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Size</option>
                  {formData.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <select
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">Color</option>
                  {formData.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                  className="p-2 border rounded-md"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                  className="p-2 border rounded-md"
                />
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 