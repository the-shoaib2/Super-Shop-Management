import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import CreateProductDialog from '@/components/dialogs/CreateProductDialog'
import { storeAPI } from '@/services/api'
import { Dialog } from '@/components/ui/dialog'

export default function ProductsList() {
  const navigate = useNavigate()
  const { currentStore } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [storeSetup, setStoreSetup] = useState({
    hasColors: false,
    hasSizes: false,
    hasCategories: false,
    hasBillboards: false,
    loading: true
  })
  const [showSetupDialog, setShowSetupDialog] = useState(false)

  useEffect(() => {
    if (currentStore?.id) {
      fetchProducts()
      checkStoreSetup()
    }
  }, [currentStore])

  const checkStoreSetup = async () => {
    try {
      const [colors, sizes, categories, billboards] = await Promise.all([
        storeAPI.getStoreColors(currentStore.id),
        storeAPI.getStoreSizes(currentStore.id),
        storeAPI.getStoreCategories(currentStore.id),
        storeAPI.getStoreBillboards(currentStore.id)
      ])

      setStoreSetup({
        hasColors: colors.data?.length > 0,
        hasSizes: sizes.data?.length > 0,
        hasCategories: categories.data?.length > 0,
        hasBillboards: billboards.data?.length > 0,
        loading: false
      })
    } catch (error) {
      console.error('Failed to check store setup:', error)
      toast.error('Failed to check store requirements')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getStoreProducts(currentStore.id)
      setProducts(response.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    const { hasColors, hasSizes, hasCategories, hasBillboards } = storeSetup
    
    if (!hasColors || !hasSizes || !hasCategories || !hasBillboards) {
      setShowSetupDialog(true)
      return
    }
    
    setShowCreateDialog(true)
  }

  const SetupRequirementsDialog = () => (
    <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
      <div className="p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <FiAlertCircle className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="text-lg font-semibold text-center mb-4">
          Complete Store Setup
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Before adding products, please set up the following:
        </p>
        <div className="space-y-4">
          <RequirementItem
            title="Colors"
            met={storeSetup.hasColors}
            path="/store/colors"
          />
          <RequirementItem
            title="Sizes"
            met={storeSetup.hasSizes}
            path="/store/sizes"
          />
          <RequirementItem
            title="Categories"
            met={storeSetup.hasCategories}
            path="/store/categories"
          />
          <RequirementItem
            title="Billboards"
            met={storeSetup.hasBillboards}
            path="/store/billboards"
          />
        </div>
      </div>
    </Dialog>
  )

  const RequirementItem = ({ title, met, path }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        {met ? (
          <div className="h-4 w-4 bg-green-500 rounded-full mr-3" />
        ) : (
          <div className="h-4 w-4 bg-yellow-500 rounded-full mr-3" />
        )}
        <span className="font-medium">{title}</span>
      </div>
      {!met && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowSetupDialog(false)
            navigate(path)
          }}
        >
          Set up
        </Button>
      )}
    </div>
  )

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
        <h2 className="text-xl font-semibold">Products</h2>
        <Button onClick={handleAddProduct}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="aspect-square relative group">
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => navigate(`/store/products/${product.id}`)}
                >
                  <FiEye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold">৳{product.price}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/store/products/${product.id}/edit`)}
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
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
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found. Create one to get started.
          </div>
        )}
      </div>

      <SetupRequirementsDialog />

      {showCreateDialog && (
        <CreateProductDialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
} 