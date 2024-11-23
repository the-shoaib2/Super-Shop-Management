import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { productAPI } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import CreateProductDialog from '@/components/dialogs/CreateProductDialog'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { currentStore } = useAuth()

  useEffect(() => {
    if (currentStore?.id) {
      fetchProducts()
    }
  }, [currentStore])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getStoreProducts(currentStore.id)
      setProducts(response.data?.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await productAPI.deleteProduct(productId)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-square relative">
              <img
                src={product.image || '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">${product.price}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found. Create one to get started.
          </div>
        )}
      </div>

      <CreateProductDialog
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false)
          fetchProducts()
        }}
      />
    </div>
  )
} 