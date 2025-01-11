import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { accountAPI } from '@/services/api'
import { Switch } from "@/components/ui/switch"
import { ImageUploadProgress } from '@/components/ui/ImageUploadProgress'
import { 
  FiImage, FiTrash2, FiPlus, FiLinkedin, FiTwitter, 
  FiFacebook, FiInstagram, FiGithub, FiLink, FiEdit2, 
  FiCheck, FiGlobe 
} from 'react-icons/fi'
import { SOCIAL_LINKS } from '../constants/settings'

export function GeneralSection({ formData, setFormData, setUser, loading, setLoading }) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, or GIF)')
      return
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 2MB')
      return
    }

    setLoading(true)
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.onProgress = (progress) => {
      setUploadProgress(progress)
    }

    try {
      const response = await accountAPI.uploadAvatar(formData)
      
      if (response.success && response.data) {
        // Update both formData and user context with the new avatar URL
        setFormData(prev => ({
          ...prev,
          avatarUrl: response.data.url
        }))

        if (setUser && typeof setUser === 'function') {
          setUser(prev => ({
            ...prev,
            avatarUrl: response.data.url
          }))
        }
        
        toast.success('Avatar uploaded successfully')
      } else {
        toast.error(response.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error(error.message || 'Failed to upload avatar')
    } finally {
      setLoading(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleWebsiteChange = (index, field, value) => {
    const newWebsites = [...formData.websites]
    newWebsites[index] = {
      ...newWebsites[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, websites: newWebsites }))
  }

  const addWebsite = () => {
    setFormData(prev => ({
      ...prev,
      websites: [...prev.websites, { name: '', url: '', type: '', isEditing: true }]
    }))
  }

  const removeWebsite = (index) => {
    setFormData(prev => ({
      ...prev,
      websites: prev.websites.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden">
            <img
              src={formData.avatarUrl || '/default-avatar.png'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                {isUploading && (
                  <span className="text-white text-sm mt-2">{uploadProgress}%</span>
                )}
              </div>
            )}
            {isUploading && <ImageUploadProgress progress={uploadProgress} />}
          </div>
          <label 
            className={`
              absolute bottom-0 right-0 
              bg-white rounded-full p-2 shadow-lg 
              cursor-pointer hover:bg-gray-50 
              transition-all duration-200 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
            `}
          >
            <FiImage className="h-4 w-4 text-gray-600" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={loading}
            />
          </label>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 2MB</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md bg-gray-50"
            value={formData.email}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Combined Websites & Social Links */}
      <div className="bg-gray-50/50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Websites & Social Links</h3>
          <button
            type="button"
            onClick={addWebsite}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        </div>

        <div className="space-y-3">
          {formData.websites.map((website, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                {!website.isEditing ? (
                  <>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {website.type && website.type !== 'Select Type' && (
                          <>
                            {SOCIAL_LINKS.find(link => link.name === website.type)?.icon && 
                              React.createElement(
                                SOCIAL_LINKS.find(link => link.name === website.type)?.icon,
                                { className: "h-5 w-5 text-gray-500" }
                              )
                            }
                          </>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {website.name || website.type}
                        </p>
                        <a 
                          href={website.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-500 hover:text-blue-600 hover:underline truncate block"
                        >
                          {website.url}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            websites: prev.websites.map((w, i) => 
                              i === index ? { ...w, isEditing: true } : w
                            )
                          }))
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeWebsite(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Type Selection */}
                    <div className="sm:col-span-3">
                      <select
                        className="w-full p-2.5 border rounded-md bg-white focus:ring-2 focus:ring-primary/20"
                        value={website.type || ''}
                        onChange={(e) => {
                          const type = e.target.value
                          handleWebsiteChange(index, 'type', type)
                          if (type !== 'Custom') {
                            handleWebsiteChange(index, 'name', type)
                          }
                        }}
                      >
                        {SOCIAL_LINKS.filter(link => link.name !== 'Select Type').map(link => (
                          <option key={link.name} value={link.name}>
                            {link.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Custom Name Input */}
                    {website.type === 'Custom' && (
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-primary/20"
                          value={website.name || ''}
                          onChange={(e) => handleWebsiteChange(index, 'name', e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>
                    )}
                    
                    {/* URL Input */}
                    <div className={`${website.type === 'Custom' ? 'sm:col-span-5' : 'sm:col-span-8'}`}>
                      <input
                        type="url"
                        className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-primary/20"
                        value={website.url || ''}
                        onChange={(e) => handleWebsiteChange(index, 'url', e.target.value)}
                        placeholder={
                          SOCIAL_LINKS.find(link => link.name === website.type)?.placeholder ||
                          'https://'
                        }
                      />
                    </div>

                    {/* Done Button */}
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            websites: prev.websites.map((w, i) => 
                              i === index ? { ...w, isEditing: false } : w
                            )
                          }))
                        }}
                        className="p-2.5 text-gray-400 hover:text-green-500 transition-colors rounded-full hover:bg-gray-50"
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {formData.websites.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No websites or social links added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div>
        <h3 className="text-lg font-medium mb-4">Account Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Account Type</p>
              <p className="text-sm text-gray-500">Your current account level</p>
            </div>
            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm">
              {formData.accountType || 'Standard'}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-gray-500">Status of your email verification</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              formData.isVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {formData.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 