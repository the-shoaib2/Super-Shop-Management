import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function PricesList() {
  const { currentStore } = useAuth()
  const [prices, setPrices] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newPrice, setNewPrice] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
    description: '',
    isActive: true,
    discountPercentage: '',
    currency: 'USD'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentStore?.id) {
      fetchPrices()
    }
  }, [currentStore])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      // API call to fetch prices
      setPrices([]) // Replace with actual API response
    } catch (error) {
      toast.error('Failed to load prices')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPrice = async (e) => {
    e.preventDefault()
    try {
      // Validate price range
      const minPrice = parseFloat(newPrice.minPrice)
      const maxPrice = parseFloat(newPrice.maxPrice)
      
      if (maxPrice <= minPrice) {
        toast.error('Maximum price must be greater than minimum price')
        return
      }

      // API call to add price range
      toast.success('Price range added successfully')
      setShowAddDialog(false)
      fetchPrices()
    } catch (error) {
      toast.error('Failed to add price range')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Price Ranges</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Price Range
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((price) => (
          <div
            key={price.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{price.name}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Range:</span>
                  <span className="font-medium">
                    {price.currency} {price.minPrice} - {price.maxPrice}
                  </span>
                </div>
                {price.discountPercentage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="font-medium text-green-600">
                      {price.discountPercentage}%
                    </span>
                  </div>
                )}
                <p className="text-sm text-gray-600">{price.description}</p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  price.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {price.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Price Range</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPrice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={newPrice.name}
                onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })}
                placeholder="Budget Range"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Price</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-md"
                  value={newPrice.minPrice}
                  onChange={(e) => setNewPrice({ ...newPrice, minPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maximum Price</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded-md"
                  value={newPrice.maxPrice}
                  onChange={(e) => setNewPrice({ ...newPrice, maxPrice: e.target.value })}
                  placeholder="100.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newPrice.currency}
                onChange={(e) => setNewPrice({ ...newPrice, currency: e.target.value })}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                {/* Add more currencies as needed */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full p-2 border rounded-md"
                value={newPrice.discountPercentage}
                onChange={(e) => setNewPrice({ ...newPrice, discountPercentage: e.target.value })}
                placeholder="Optional discount percentage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows="3"
                value={newPrice.description}
                onChange={(e) => setNewPrice({ ...newPrice, description: e.target.value })}
                placeholder="Describe this price range..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newPrice.isActive}
                onChange={(e) => setNewPrice({ ...newPrice, isActive: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>

            <Button type="submit" className="w-full">
              Add Price Range
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 