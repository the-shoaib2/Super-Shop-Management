import { useState } from 'react'
import { FiImage, FiUploadCloud, FiX } from 'react-icons/fi'
import { BaseActionDialog } from './BaseActionDialog'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import CLOUDINARY_API from '@/services/api/cloudinaryAPI';
import ImageUploadProgress from '@/components/ui/ImageUploadProgress'

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        onBillboardChange(prev => ({ ...prev, imageUrl: '' }))
        return
      }
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) {
      onBillboardChange(prev => ({ ...prev, imageUrl: '' }))
      return
    }

    setSelectedImage(file)
    setUploadProgress(0)

    try {
      // Start upload progress indication
      setUploadProgress(20)

      // Upload to Cloudinary
      const result = await CLOUDINARY_API.uploadImage(file, 'billboards')
      
      if (result.success) {
        setUploadProgress(100)
        // Update billboard with the Cloudinary URL
        onBillboardChange(prev => ({ 
          ...prev, 
          imageUrl: result.data.url 
        }))
      } else {
        throw new Error(result.message || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadProgress(0)
      onBillboardChange(prev => ({ ...prev, imageUrl: '' }))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) {
      onBillboardChange(prev => ({ ...prev, imageUrl: '' }))
      return
    }
    handleFileUpload(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    setUploadProgress(0)
    onBillboardChange(prev => ({ ...prev, imageUrl: '' }))
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
          <div
            className={cn(
              "mt-1 relative border-2 border-dashed rounded-md transition-all duration-200",
              isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50",
              newBillboard.imageUrl ? "p-2" : "px-4 py-8"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!newBillboard.imageUrl ? (
              <div className="space-y-2 text-center">
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex flex-col items-center text-sm text-gray-600">
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
            ) : (
              <div className="relative">
                <img
                  src={newBillboard.imageUrl}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-md"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <ImageUploadProgress progress={uploadProgress} />
            )}
          </div>
        </div>
      </div>
    </BaseActionDialog>
  )
} 