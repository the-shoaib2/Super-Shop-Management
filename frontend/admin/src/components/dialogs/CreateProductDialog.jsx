import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { storeAPI } from '@/services/api'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import { 
  AnimatedDialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogCloseButton 
} from '@/components/ui/animated-dialog'

export default function CreateProductDialog({ isOpen, onClose }) {
  const { currentStore } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState({
    colors: [],
    sizes: [],
    categories: [],
    billboards: []
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    colors: [],
    billboardId: '',
    images: []
  })
  const [errors, setErrors] = useState({})
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (isOpen && currentStore?.id) {
      loadOptions()
    }
  }, [isOpen, currentStore])

  const loadOptions = async () => {
    try {
      const [colors, sizes, categories, billboards] = await Promise.all([
        storeAPI.getStoreColors(currentStore.id),
        storeAPI.getStoreSizes(currentStore.id),
        storeAPI.getStoreCategories(currentStore.id),
        storeAPI.getStoreBillboards(currentStore.id)
      ])

      setOptions({
        colors: colors.data || [],
        sizes: sizes.data || [],
        categories: categories.data || [],
        billboards: billboards.data || []
      })
    } catch (error) {
      console.error('Failed to load options:', error)
      toast.error('Failed to load product options')
    }
  }

  const formProgress = useMemo(() => {
    let progress = 0;
    if (formData.name) progress += 20;
    if (formData.price) progress += 20;
    if (formData.category) progress += 20;
    if (formData.colors.length > 0) progress += 15;
    if (formData.sizes.length > 0) progress += 15;
    if (formData.images.length > 0) progress += 10;
    return progress;
  }, [formData]);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) toast.error(`${file.name} is not a valid image file`);
      return isValid;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  }, [formData.images]);

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.name) newErrors.name = 'Product name is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }
    
    if (stepNumber === 2) {
      if (formData.colors.length === 0) newErrors.colors = 'Select at least one color';
      if (formData.sizes.length === 0) newErrors.sizes = 'Select at least one size';
    }
    
    if (stepNumber === 3) {
      if (formData.images.length === 0) newErrors.images = 'Add at least one image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const FormField = ({ label, error, children }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        {label}
        {error && <span className="text-red-500 text-xs ml-2">{error}</span>}
      </label>
      {children}
    </div>
  )

  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FormField label="Product Name *" error={errors.name} className="md:col-span-2">
        <input
          type="text"
          className={`w-full h-10 px-3 border rounded-md focus:ring-1 focus:ring-primary transition-all
            ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: null }));
          }}
          placeholder="Enter product name"
        />
      </FormField>

      <FormField label="Price *" error={errors.price}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`w-full h-10 pl-8 pr-3 border rounded-md focus:ring-1 focus:ring-primary transition-all
              ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
            value={formData.price}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, price: e.target.value }));
              if (errors.price) setErrors(prev => ({ ...prev, price: null }));
            }}
            placeholder="0.00"
          />
        </div>
      </FormField>

      <FormField label="Category *" error={errors.category}>
        <div className="relative">
          <select
            className={`w-full h-10 px-3 pr-8 border rounded-md focus:ring-1 focus:ring-primary transition-all appearance-none bg-white
              ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
            value={formData.category}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, category: e.target.value }));
              if (errors.category) setErrors(prev => ({ ...prev, category: null }));
            }}
          >
            <option value="" className="text-gray-500">Select Category</option>
            {options.categories.map(category => (
              <option key={category.id} value={category.id} className="text-gray-900">
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {errors.category && (
            <div className="absolute -bottom-5 left-0 text-xs text-red-500">
              {errors.category}
            </div>
          )}
        </div>
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Description">
          <textarea
            className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-primary transition-all border-gray-200 min-h-[80px]"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your product..."
          />
        </FormField>
      </div>
    </div>
  )

  const VariantButton = ({ selected, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 rounded-md border transition-all duration-200 text-sm
        ${selected 
          ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]' 
          : 'border-gray-200 hover:border-primary/50'
        }
      `}
    >
      {children}
    </button>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium">Colors</label>
          <span className="text-sm text-muted-foreground">Selected: {formData.colors.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {options.colors.map(color => (
            <VariantButton
              key={color.id}
              selected={formData.colors.includes(color.id)}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  colors: prev.colors.includes(color.id)
                    ? prev.colors.filter(id => id !== color.id)
                    : [...prev.colors, color.id]
                }))
              }}
            >
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3 border shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm">{color.name}</span>
              </div>
            </VariantButton>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium">Sizes</label>
          <span className="text-sm text-muted-foreground">Selected: {formData.sizes.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {options.sizes.map(size => (
            <VariantButton
              key={size.id}
              selected={formData.sizes.includes(size.id)}
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  sizes: prev.sizes.includes(size.id)
                    ? prev.sizes.filter(id => id !== size.id)
                    : [...prev.sizes, size.id]
                }))
              }}
            >
              <span className="text-sm block">{size.name}</span>
              {size.value && <span className="text-xs text-muted-foreground mt-1">{size.value}</span>}
            </VariantButton>
          ))}
        </div>
      </div>
    </div>
  )

  const ImagePreview = ({ image, index, onRemove }) => (
    <div className="relative aspect-square group rounded-lg overflow-hidden border">
      <img
        src={image.preview}
        alt={`Preview ${index + 1}`}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onRemove(index)}
          className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full text-red-500"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      {index === 0 && (
        <span className="absolute top-2 left-2 px-3 py-1 bg-primary text-white text-xs rounded-full">
          Main Image
        </span>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {formData.images.map((image, index) => (
        <ImagePreview
          key={index}
          image={image}
          index={index}
          onRemove={removeImage}
        />
      ))}
      
      {formData.images.length < 5 && (
        <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 group">
          <FiUpload className="w-8 h-8 mb-2 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm text-muted-foreground group-hover:text-primary">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>
  )

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="overflow-hidden shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] rounded-xl"
    >
      <div className="flex flex-col h-[600px]">
        <DialogHeader className="px-4 py-3 border-b flex-shrink-0">
          <div className="flex flex-col">
            <DialogTitle className="text-lg font-semibold">
              {step === 1 && "Product Details"}
              {step === 2 && "Product Variants"}
              {step === 3 && "Product Images"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === 1 && "Enter basic product information"}
              {step === 2 && "Configure product variants and options"}
              {step === 3 && "Add product images and media"}
            </p>
          </div>
          <DialogCloseButton onClose={onClose} />
        </DialogHeader>

        <DialogContent className="flex-1 overflow-y-auto px-4">
          <div className="py-3 sticky top-0 bg-white z-10">
            <div className="relative flex justify-between">
              {[
                { step: 1, label: "Details" },
                { step: 2, label: "Variants" },
                { step: 3, label: "Media" }
              ].map(({ step: stepNum, label }) => (
                <div
                  key={stepNum}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-200 shadow-sm
                      ${step >= stepNum 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {stepNum}
                  </div>
                  <span className={`
                    text-xs mt-2 font-medium transition-colors
                    ${step >= stepNum ? 'text-primary' : 'text-muted-foreground'}
                  `}>
                    {label}
                  </span>
                </div>
              ))}
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-[2px] bg-muted -z-10">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="transition-all duration-200 transform">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>
          </div>
        </DialogContent>

        <DialogFooter className="px-4 py-3 border-t bg-muted/50 flex-shrink-0">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              size="sm"
              className="min-w-[80px]"
            >
              Previous
            </Button>
            <Button
              onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
              size="sm"
              className="min-w-[80px]"
            >
              {step === 3 ? 'Create' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </AnimatedDialog>
  )
} 