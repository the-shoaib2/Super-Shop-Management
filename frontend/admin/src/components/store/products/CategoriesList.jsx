import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function CategoriesList() {
  const { currentStore } = useAuth()
  const [categories, setCategories] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    billboardId: '',
    imageUrl: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [billboards, setBillboards] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (currentStore?.id) {
      fetchCategories()
      fetchBillboards()
    }
  }, [currentStore])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // API call to fetch categories
      setCategories([]) // Replace with actual API response
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchBillboards = async () => {
    try {
      // API call to fetch billboards for dropdown
      setBillboards([]) // Replace with actual API response
    } catch (error) {
      toast.error('Failed to load billboards')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCategory(prev => ({ ...prev, imageUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      if (selectedImage) {
        formData.append('image', selectedImage)
      }
      formData.append('name', newCategory.name)
      formData.append('description', newCategory.description)
      formData.append('billboardId', newCategory.billboardId)
      formData.append('isActive', newCategory.isActive)

      // API call to add category
      toast.success('Category added successfully')
      setShowAddDialog(false)
      fetchCategories()
    } catch (error) {
      toast.error('Failed to add category')
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
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {category.imageUrl && (
              <div className="aspect-[16/9] relative">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              
              {category.billboard && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Billboard: {category.billboard.label}
                  </span>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
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
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows="3"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Billboard</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newCategory.billboardId}
                onChange={(e) => setNewCategory({ ...newCategory, billboardId: e.target.value })}
              >
                <option value="">Select Billboard</option>
                {billboards.map(billboard => (
                  <option key={billboard.id} value={billboard.id}>
                    {billboard.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {newCategory.imageUrl && (
                <div className="mt-2">
                  <img
                    src={newCategory.imageUrl}
                    alt="Preview"
                    className="h-32 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newCategory.isActive}
                onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>

            <Button type="submit" className="w-full">
              Add Category
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 