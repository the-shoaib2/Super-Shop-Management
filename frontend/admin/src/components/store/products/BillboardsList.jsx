import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function BillboardsList() {
  const { currentStore } = useAuth()
  const [billboards, setBillboards] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newBillboard, setNewBillboard] = useState({
    label: '',
    imageUrl: '',
    description: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (currentStore?.id) {
      fetchBillboards()
    }
  }, [currentStore])

  const fetchBillboards = async () => {
    try {
      setLoading(true)
      // API call to fetch billboards
      setBillboards([]) // Replace with actual API response
    } catch (error) {
      toast.error('Failed to load billboards')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewBillboard(prev => ({ ...prev, imageUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddBillboard = async (e) => {
    e.preventDefault()
    try {
      if (!selectedImage) {
        toast.error('Please select an image')
        return
      }

      // Create form data for API call
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('label', newBillboard.label)
      formData.append('description', newBillboard.description)
      formData.append('isActive', newBillboard.isActive)

      // API call to add billboard
      toast.success('Billboard added successfully')
      setShowAddDialog(false)
      fetchBillboards()
    } catch (error) {
      toast.error('Failed to add billboard')
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
        <h2 className="text-xl font-semibold">Billboards</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          Add Billboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {billboards.map((billboard) => (
          <div
            key={billboard.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="aspect-[16/9] relative">
              <img
                src={billboard.imageUrl}
                alt={billboard.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold text-center px-4">
                  {billboard.label}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{billboard.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  billboard.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {billboard.isActive ? 'Active' : 'Inactive'}
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
            <DialogTitle>Add Billboard</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBillboard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={newBillboard.label}
                onChange={(e) => setNewBillboard({ ...newBillboard, label: e.target.value })}
                placeholder="Summer Collection 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows="3"
                value={newBillboard.description}
                onChange={(e) => setNewBillboard({ ...newBillboard, description: e.target.value })}
                placeholder="Describe this billboard..."
              />
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
              {newBillboard.imageUrl && (
                <div className="mt-2">
                  <img
                    src={newBillboard.imageUrl}
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
                checked={newBillboard.isActive}
                onChange={(e) => setNewBillboard({ ...newBillboard, isActive: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>

            <Button type="submit" className="w-full">
              Add Billboard
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 