import { useState, useEffect } from 'react'
import { FormField } from '../shared/FormField'
import { useAuth } from '@/contexts/auth-context'
import { priceAPI } from '@/services/api/store/priceAPI'
import { FiDollarSign } from 'react-icons/fi'

export const ProductDetailsStep = ({ formData, setFormData, errors, setErrors, options }) => {
  const { currentStore } = useAuth()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch prices when component mounts
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await priceAPI.getActivePrices(currentStore.id)
        if (response.success) {
          setPrices(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch prices:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentStore?.id) {
      fetchPrices()
    }
  }, [currentStore?.id])

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Product Name *" error={errors.name}>
            <input
              type="text"
              className={`w-full h-11 px-4 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                ${errors.name ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  name: value
                }));
                if (errors.name) {
                  setErrors(prev => ({
                    ...prev,
                    name: null
                  }));
                }
              }}
              placeholder="Enter product name"
            />
          </FormField>
        </div>

        {/* Price Selection */}
        <FormField label="Price *" error={errors.priceId}>
          <div className="relative">
            <select
              className={`w-full h-11 px-4 border-2 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                ${errors.priceId ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
              value={formData.priceId}
              onChange={(e) => {
                const value = e.target.value;
                const selectedPrice = prices.find(p => p.id === value);
                
                setFormData(prev => ({
                  ...prev,
                  priceId: value,
                  price: selectedPrice ? selectedPrice.amounts[selectedPrice.defaultCurrency] : ''
                }));
                
                if (errors.priceId) {
                  setErrors(prev => ({
                    ...prev,
                    priceId: null
                  }));
                }
              }}
            >
              <option value="">Select Price</option>
              {prices.map(price => (
                <option key={price.id} value={price.id}>
                  {price.type} - {price.currencies?.find(c => c.code === price.defaultCurrency)?.symbol}
                  {price.amounts[price.defaultCurrency]} 
                  {price.isDiscounted && ` (${price.discountPercentages[price.defaultCurrency]}% off)`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </FormField>

        <FormField label="Category *" error={errors.category}>
          <div className="relative">
            <select
              className={`w-full h-11 px-4 border-2 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                ${errors.category ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
              value={formData.category}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  category: value
                }));
                if (errors.category) {
                  setErrors(prev => ({
                    ...prev,
                    category: null
                  }));
                }
              }}
            >
              <option value="">Select Category</option>
              {options.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        {/* Stock Status and Quantity */}
        <FormField label="Stock Status *" error={errors.stockStatus}>
          <select
            className={`w-full h-11 px-4 border-2 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
              ${errors.stockStatus ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
            value={formData.stockStatus}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                stockStatus: value
              }));
              if (errors.stockStatus) {
                setErrors(prev => ({
                  ...prev,
                  stockStatus: null
                }));
              }
            }}
          >
            <option value="">Select Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="backorder">On Backorder</option>
          </select>
        </FormField>

        <FormField label="Quantity *" error={errors.quantity}>
          <div className="relative">
            <input
              type="number"
              min="0"
              className={`w-full h-11 px-4 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                ${errors.quantity ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
              value={formData.quantity}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  quantity: value,
                  stockStatus: parseInt(value) > 0 ? 'in_stock' : 'out_of_stock'
                }));
                if (errors.quantity) {
                  setErrors(prev => ({
                    ...prev,
                    quantity: null
                  }));
                }
              }}
              placeholder="Enter quantity"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  const currentQty = parseInt(formData.quantity) || 0;
                  if (currentQty > 0) {
                    setFormData(prev => ({
                      ...prev,
                      quantity: (currentQty - 1).toString(),
                      stockStatus: currentQty - 1 > 0 ? 'in_stock' : 'out_of_stock'
                    }));
                  }
                }}
              >
                -
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => {
                  const currentQty = parseInt(formData.quantity) || 0;
                  setFormData(prev => ({
                    ...prev,
                    quantity: (currentQty + 1).toString(),
                    stockStatus: 'in_stock'
                  }));
                }}
              >
                +
              </button>
            </div>
          </div>
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Description">
            <textarea
              className="w-full px-4 py-3 border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all
                border-gray-200 hover:border-gray-300 min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  description: value
                }));
              }}
              placeholder="Describe your product..."
            />
          </FormField>
        </div>
      </div>
    </div>
  )
} 