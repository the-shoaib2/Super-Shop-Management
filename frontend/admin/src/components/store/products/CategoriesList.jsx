import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/auth-context'
import { storeAPI } from '@/services/api'
import { DeleteDialog } from '@/components/dialogs/actions/DeleteDialog'
import { ProductViews } from '@/components/views/ProductViewImplementations'
import { ViewModeSelector } from '@/components/views/ViewModeSelector'
import { CategoryActionDialog } from '@/components/dialogs/actions/CategoryActionDialogs'

export default function CategoriesList() {
  const { currentStore } = useAuth()
  const [categories, setCategories] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')

  const fetchCategories = async () => {
    if (!currentStore?.id) {
      setCategories([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('Fetching categories for store:', currentStore.id)
      const response = await storeAPI.getStoreCategories(currentStore.id)
      console.log('Categories response:', response)

      if (response.success) {
        setCategories(response.data || [])
      } else {
        toast.error(response.message || 'Failed to load categories')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [currentStore])

  const handleSuccess = () => {
    console.log('Category operation successful, refreshing list...')
    fetchCategories()
  }

  const handleEditClick = (category) => {
    setSelectedCategory(category)
    setShowAddDialog(true)
  }

  const handleDeleteClick = (category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await storeAPI.deleteStoreCategory(currentStore.id, selectedCategory.id)
      toast.success('Category deleted successfully')
      fetchCategories()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const ViewComponent = ProductViews.Categories[
    viewMode.charAt(0).toUpperCase() + viewMode.slice(1)
  ]

  return (
    <div className="space-y-4 bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">Categories</h2>

          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <ViewModeSelector 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
              className="w-full sm:w-auto"
            />
            <Button 
              onClick={() => {
                setSelectedCategory(null)
                setShowAddDialog(true)
              }}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {categories.length > 0 ? (
          <ViewComponent
            items={categories}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50/50 px-6 py-10">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new category.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="w-full sm:w-auto"
                >
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CategoryActionDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        itemName={selectedCategory?.name}
        itemType="category"
      />
    </div>
  )
} 