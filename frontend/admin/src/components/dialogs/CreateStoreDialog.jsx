import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from "@/lib/utils"
import { storeAPI } from '@/services/api'

const STORE_CATEGORIES = [
  'Retail',
  'Restaurant',
  'Grocery',
  'Electronics',
  'Fashion',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Stationery',
  'Other'
]

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  address: '',
  phone: '',
  email: ''
}

export default function CreateStoreDialog({ open, onClose, onStoreCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        toast.error('Store name is required')
        return
      }

      // Prepare store data
      const storeData = {
        name: formData.name.trim(),
        type: formData.category ? [formData.category] : [],
        description: formData.description?.trim() || '',
        address: formData.address?.trim() || '',
        location: formData.location?.trim() || '',
        phone: formData.phone?.trim() || '',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        email: user?.email // Use authenticated user's email
      }

      const response = await storeAPI.createStore(storeData)

      if (response?.success) {
        toast.success('Store created successfully!')
        onClose()
        // Refresh user's stores list if needed
        if (typeof onStoreCreated === 'function') {
          onStoreCreated(response.data)
        }
      } else {
        throw new Error(response?.message || 'Failed to create store')
      }
    } catch (error) {
      console.error('Store creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "w-[650px] max-h-[700px] overflow-y-auto",
          "transform transition-all duration-300 ease-in-out",
          "scale-100 opacity-100",
          "data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
          "data-[state=open]:scale-100 data-[state=open]:opacity-100"
        )}
      >
        <DialogHeader>
          <DialogTitle>Create Store</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new store
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name *</label>
              <input
                type="text"
                required
                name="name"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter store name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                required
                name="category"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {STORE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary min-h-[80px]"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your store..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                type="text"
                required
                name="address"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter store address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                required
                name="location"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                type="tel"
                required
                name="phone"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary"
                placeholder="organic, vegan, local"
                value={formData.tags}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground mt-0.5">
                Separate with commas
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full py-4 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Store'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 