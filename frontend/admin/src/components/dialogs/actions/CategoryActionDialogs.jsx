import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { storeAPI } from '@/services/api'
import { BaseActionDialog } from './BaseActionDialog'

export function CategoryActionDialog({ isOpen, onClose, category, onSuccess }) {
  const { currentStore } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storeId: '',
    slug: '',
    rank: '',
    status: 'active',
    type: 'default'
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        storeId: currentStore?.id || '',
        slug: category.slug || '',
        rank: category.rank || '',
        status: category.status || 'active',
        type: category.type || 'default'
      })
    } else {
      setFormData({
        name: '',
        description: '',
        storeId: currentStore?.id || '',
        slug: '',
        rank: '',
        status: 'active',
        type: 'default'
      })
    }
  }, [category, currentStore])

  const handleConfirm = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!currentStore?.id) {
      toast.error('Store not found')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        storeId: currentStore.id
      }

      console.log('Saving category with payload:', payload)

      const response = category 
        ? await storeAPI.updateStoreCategory(currentStore.id, category.id, payload)
        : await storeAPI.createStoreCategory(currentStore.id, payload)

      if (response.success) {
        toast.success(category ? 'Category updated successfully' : 'Category created successfully')
        if (onSuccess) {
          await onSuccess()
        }
        onClose()
      } else {
        throw new Error(response.message || `Failed to ${category ? 'update' : 'create'} category`)
      }
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error(error.message || `Failed to ${category ? 'update' : 'create'} category`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={category ? 'Edit Category' : 'Add Category'}
      confirmText="Save Category"
      description={
        category 
          ? "Update your category details. Categories help organize your products effectively."
          : "Create a new category to organize your products. Categories make it easier for customers to find what they're looking for."
      }
    >
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-900"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter category description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-h-[100px] resize-y placeholder:text-gray-400"
            rows={4}
          />
        </div>
      </div>
    </BaseActionDialog>
  )
} 