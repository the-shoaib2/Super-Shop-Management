import { Button } from '@/components/ui/button'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

export const GridView = ({ items, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((price) => price && (
        <div
          key={price.id}
          className="bg-white rounded-lg border shadow-sm overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {price.type ? price.type.charAt(0).toUpperCase() + price.type.slice(1) : 'Regular'} Price
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {price.productIds?.length || 0} Products
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClick(price)}
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(price)}
                >
                  <FiTrash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {price.amounts && Object.entries(price.amounts).map(([currency, amount]) => (
                <div key={currency} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{currency}</span>
                  <div className="flex items-center gap-2">
                    {price.compareAtPrices?.[currency] && (
                      <span className="text-sm text-gray-400 line-through">
                        {price.currencies?.find(c => c.code === currency)?.symbol || ''}
                        {price.compareAtPrices[currency]}
                      </span>
                    )}
                    <span className="font-semibold">
                      {price.currencies?.find(c => c.code === currency)?.symbol || ''}
                      {amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const ListView = ({ items, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="space-y-3">
      {items.map((price) => price && (
        <div
          key={price.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900">
              {price.type ? price.type.charAt(0).toUpperCase() + price.type.slice(1) : 'Regular'} Price
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {price.productIds?.length || 0} Products
            </p>
            <div className="mt-2 flex gap-4">
              {price.amounts && Object.entries(price.amounts).map(([currency, amount]) => (
                <div key={currency} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{currency}</span>
                  <div className="flex items-center gap-1">
                    {price.compareAtPrices?.[currency] && (
                      <span className="text-sm text-gray-400 line-through">
                        {price.currencies?.find(c => c.code === currency)?.symbol || ''}
                        {price.compareAtPrices[currency]}
                      </span>
                    )}
                    <span className="font-semibold">
                      {price.currencies?.find(c => c.code === currency)?.symbol || ''}
                      {amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditClick(price)}
            >
              <FiEdit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(price)}
            >
              <FiTrash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
} 