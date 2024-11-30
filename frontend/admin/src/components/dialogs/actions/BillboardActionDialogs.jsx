import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { BaseActionDialog } from './BaseActionDialog'
import { Button } from '@/components/ui/button'

export const BillboardPickerDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  billboard,
  newBillboard = {
    label: '',
    imageUrl: '',
    description: '',
    isActive: true
  },
  onBillboardChange,
  isEdit = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        onBillboardChange(prev => ({ ...prev, imageUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <BaseActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isEdit ? 'Edit Billboard' : 'Add New Billboard'}
      confirmText={isEdit ? 'Update Billboard' : 'Add Billboard'}
      description={isEdit 
        ? 'Edit the billboard details below.' 
        : 'Add a new billboard by uploading an image and entering details.'
      }
    >
      <div className="space-y-4 py-2 max-h-[700px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
              value={newBillboard.label}
              onChange={(e) => onBillboardChange({ ...newBillboard, label: e.target.value })}
              placeholder="Summer Collection 2024"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={newBillboard.isActive}
              onChange={(e) => onBillboardChange({ ...newBillboard, isActive: e.target.checked })}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows="2"
            value={newBillboard.description}
            onChange={(e) => onBillboardChange({ ...newBillboard, description: e.target.value })}
            placeholder="Describe this billboard..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="mt-1 flex justify-center px-4 py-4 border-2 border-dashed rounded-md hover:border-primary/50 transition-colors">
            <div className="space-y-2 text-center">
              <FiImage className="mx-auto h-10 w-10 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 transition-colors">
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
                className="h-40 w-full object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </BaseActionDialog>
  )
} 