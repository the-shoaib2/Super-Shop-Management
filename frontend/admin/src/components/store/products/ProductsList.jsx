import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import CreateProductDialog from '@/components/dialogs/product/index'
import { storeAPI } from '@/services/api'
import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton 
} from '@/components/ui/animated-dialog'

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
    const allRequirementsMet = 
      storeSetup.hasColors && 
      storeSetup.hasSizes && 
      storeSetup.hasCategories && 
      storeSetup.hasBillboards;

    if (!allRequirementsMet) {
      setShowSetupDialog(true);
    } else {
      setShowCreateDialog(true);
    }
  }

  const SetupRequirementsDialog = () => {
    const allRequirementsMet = Object.values(storeSetup).every(value => 
      value === true || value === false
    ) && storeSetup.hasColors && storeSetup.hasSizes && 
      storeSetup.hasCategories && storeSetup.hasBillboards;

    return (
      <AnimatedDialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogHeader>
          <DialogTitle>
            {allRequirementsMet ? "Store Setup Complete" : "Complete Store Setup"}
          </DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogContent>
          {allRequirementsMet ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                All requirements are met! You're ready to add products.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Before adding products, please set up the following:
              </p>
              <div className="space-y-3">
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
            </>
          )}
        </DialogContent>
        <DialogFooter>
          {allRequirementsMet ? (
            <Button 
              size="sm" 
              onClick={() => {
                setShowSetupDialog(false);
                handleAddProduct();
              }}
            >
              Add Product
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowSetupDialog(false)}>
                Close
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/store/setup')}>
                Set up
              </Button>
            </>
          )}
        </DialogFooter>
      </AnimatedDialog>
    )
  }

  const RequirementItem = ({ title, met, path }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg transition-colors
      ${met ? 'bg-green-50' : 'bg-gray-50'}`}
    >
      <div className="flex items-center gap-3">
        {met ? (
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
            <FiAlertCircle className="w-3 h-3 text-yellow-600" />
          </div>
        )}
        <span className={`font-medium ${met ? 'text-green-800' : 'text-gray-700'}`}>
          {title}
        </span>
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

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchProducts(); // Refresh the products list
  };

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
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  )
} 