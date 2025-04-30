import { useState, useEffect } from 'react'
import { AnimatedDialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogCloseButton } from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/auth-context'
import { priceAPI } from '@/services/api/store/priceAPI'
import { FiDollarSign } from 'react-icons/fi'

export default function CreatePriceDialog({ isOpen, onClose, onSuccess, initialData }) {
  const { currentStore } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amounts: {},
    compareAtPrices: {},
    currencies: [],
    defaultCurrency: 'BDT',
    productIds: [],
    type: 'regular',
    isActive: true
  })

  // Initialize with default BDT currency
  useEffect(() => {
    if (isOpen && !initialData) {
      setFormData(prev => ({
        ...prev,
        currencies: [{
          code: 'BDT',
          symbol: '৳',
          name: 'Bangladeshi Taka',
          isDefault: true,
          exchangeRate: 1.0
        }]
      }))
    }
  }, [isOpen, initialData])

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData)
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Validate required fields
      if (!formData.amounts[formData.defaultCurrency]) {
        toast.error('Price amount is required')
        return
      }

      const response = initialData?.id
        ? await priceAPI.updatePrice(currentStore.id, initialData.id, formData)
        : await priceAPI.createPrice(currentStore.id, formData)

      if (response.success) {
        toast.success(response.message)
        if (onSuccess) {
          await onSuccess(response.data)
        }
        onClose()
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Price operation error:', error)
      toast.error(error.message || `Failed to ${initialData ? 'update' : 'create'} price`)
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (currencyCode, value) => {
    setFormData(prev => ({
      ...prev,
      amounts: {
        ...prev.amounts,
        [currencyCode]: parseFloat(value) || 0
      }
    }))
  }

  const handleCompareAtPriceChange = (currencyCode, value) => {
    setFormData(prev => ({
      ...prev,
      compareAtPrices: {
        ...prev.compareAtPrices,
        [currencyCode]: parseFloat(value) || 0
      }
    }))
  }

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-xl"
      className="overflow-hidden shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] rounded-xl"
    >
      <form onSubmit={handleSubmit}>
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>
            {initialData ? 'Edit Price' : 'Create New Price'}
          </DialogTitle>
          <DialogCloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent className="p-4">
          <div className="space-y-4">
            {/* Price Inputs */}
            {formData.currencies.map((currency) => (
              <div key={currency.code} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price ({currency.symbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20"
                      value={formData.amounts[currency.code] || ''}
                      onChange={(e) => handleAmountChange(currency.code, e.target.value)}
                      required={currency.isDefault}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Compare at Price ({currency.symbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20"
                      value={formData.compareAtPrices[currency.code] || ''}
                      onChange={(e) => handleCompareAtPriceChange(currency.code, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Price Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Price Type</label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="regular">Regular Price</option>
                <option value="sale">Sale Price</option>
                <option value="wholesale">Wholesale Price</option>
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Price is active
              </label>
            </div>
          </div>
        </DialogContent>

        <DialogFooter className="px-4 py-3 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Price' : 'Create Price'}
          </Button>
        </DialogFooter>
      </form>
    </AnimatedDialog>
  )
} 