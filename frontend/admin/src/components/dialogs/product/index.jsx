import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { productAPI } from '../../../services/api/store/productAPI';
import { storeAPI } from '../../../services/api/store/storeAPI';
import { ProductDetailsStep } from './ProductDetailsStep'
import { ProductVariantsStep } from './ProductVariantsStep'
import { ProductImagesStep } from './ProductImagesStep'
import { AnimatedDialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogCloseButton } from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import CLOUDINARY_API from '@/services/api/cloudinary/cloudinaryAPI'

export default function CreateProductDialog({ isOpen, onClose, onSuccess, initialData }) {
  const { currentStore } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showAllColors, setShowAllColors] = useState(false)
  const [showAllSizes, setShowAllSizes] = useState(false)
  const [options, setOptions] = useState({
    products: [],
    product: null,
    colors: [],
    sizes: [],
    categories: [],
    billboards: [],
    prices: []
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: [],
    colors: [],
    billboardId: '',
    images: [],
    imageUrls: [],
    stockStatus: '',
    quantity: ''
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
      if (!currentStore?.id) {
        console.error('No current store ID available')
        toast.error('No store selected')
        return
      }

      const [products, product, colors, sizes, categories, billboards, prices] = await Promise.allSettled([
        productAPI.getProducts(currentStore.id),
        productAPI.getProductsbyIds(initialData?.id),
        storeAPI.getStoreColors(currentStore.id),
        storeAPI.getStoreSizes(currentStore.id),
        storeAPI.getStoreCategories(currentStore.id),
        storeAPI.getStoreBillboards(currentStore.id),
        productAPI.getActivePrices(currentStore.id)
      ])

      const logApiResult = (name, result) => {
        if (result.status === 'rejected') {
          console.error(`${name} API call failed:`, result.reason)
        } else if (result.status === 'fulfilled') {
          console.log(`${name} API result:`, result.value)
        }
      }

      logApiResult('Products', products)
      logApiResult('Product', product)
      logApiResult('Colors', colors)
      logApiResult('Sizes', sizes)
      logApiResult('Categories', categories)
      logApiResult('Billboards', billboards)
      logApiResult('Prices', prices)

      const extractData = (result) => 
        result.status === 'fulfilled' && result.value?.success 
          ? result.value.data 
          : []

      const extractSingleData = (result) => 
        result.status === 'fulfilled' && result.value?.success 
          ? result.value.data 
          : null

      setOptions({
        products: extractData(products),
        product: extractSingleData(product),
        colors: extractData(colors),
        sizes: extractData(sizes),
        categories: extractData(categories),
        billboards: extractData(billboards),
        prices: extractData(prices)
      })

      const productData = extractSingleData(product)
      if (productData) {
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          category: productData.category?.id || '',
          sizes: productData.sizes?.map(size => size.id) || [],
          colors: productData.colors?.map(color => color.id) || [],
          billboardId: productData.billboardId || '',
          images: productData.images || [],
          imageUrls: productData.images || [],
          stockStatus: productData.stockStatus || '',
          quantity: productData.quantity || ''
        })
      }
    } catch (error) {
      console.error('Comprehensive error in loadOptions:', error)
      toast.error(`Failed to load options: ${error.message}`)
      
      setOptions({
        products: [],
        product: null,
        colors: [],
        sizes: [],
        categories: [],
        billboards: [],
        prices: []
      })
    }
  }

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      if (!isValid) {
        toast.error(`${file.name} is not valid (max 5MB, JPG/PNG only)`);
      }
      return isValid;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      progress: 0
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    newImages.forEach((image, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFormData(prev => ({
          ...prev,
          images: prev.images.map((img, i) => {
            if (i === prev.images.length - newImages.length + index) {
              return { ...img, progress };
            }
            return img;
          })
        }));

        if (progress >= 100) {
          clearInterval(interval);
          setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => {
              if (i === prev.images.length - newImages.length + index) {
                return { ...img, uploading: false };
              }
              return img;
            })
          }));
        }
      }, 300);
    });
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

  const handleSubmit = async () => {
    try {
      if (!validateStep(3)) {
        return;
      }

      setLoading(true);

      let uploadedImages = [];
      
      if (formData.images.length > 0) {
        const imagesToUpload = formData.images.map(img => img.file);
        
        try {
          const uploadResponse = await CLOUDINARY_API.uploadImages(imagesToUpload, 'products');
          
          if (!uploadResponse || !uploadResponse.success) {
            console.error('Upload failed:', uploadResponse);
            toast.error(`Image upload failed: ${uploadResponse?.message || 'Unknown error'}`);
            throw new Error('Failed to upload images: ' + (uploadResponse?.message || 'No response'));
          }
          
          if (!uploadResponse.data || !Array.isArray(uploadResponse.data)) {
            console.error('Invalid upload response data:', uploadResponse);
            throw new Error('Invalid image upload response');
          }
          
          uploadedImages = uploadResponse.data.map(img => 
            img.secure_url || img.url || null
          ).filter(url => url !== null);
        } catch (error) {
          console.error('Image upload error:', error);
          toast.error(`Failed to upload images: ${error.message}`);
          throw error;
        }
      }

      const allImages = [
        ...uploadedImages,
        ...(formData.imageUrls?.filter(url => url) || [])
      ];

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.category,
        sizeIds: formData.sizes,
        colorIds: formData.colors,
        images: uploadedImages.length > 0 ? uploadedImages : [null], 
        storeId: currentStore.id,
        type: 'price',
        stockStatus: formData.stockStatus,
        quantity: formData.quantity
      };

      
      let response;
      
      if (initialData?.id) {
        response = await productAPI.updateStoreProduct(
          currentStore.id,
          initialData.id,
          productData
        );
      } else {
        response = await productAPI.createStoreProduct(
          currentStore.id, 
          productData
        );
      }

      if (response.success) {
        toast.success(response.message);
        if (onSuccess) {
          await onSuccess(response.data);
        }
        onClose();
      } else {
        throw new Error(response.message || `Failed to ${initialData ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Product operation error:', error);
      toast.error(error.message || `Failed to ${initialData ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          <ProductDetailsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            options={options}
          />
        )
      case 2:
        return (
          <ProductVariantsStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            options={options}
            showAllColors={showAllColors}
            setShowAllColors={setShowAllColors}
            showAllSizes={showAllSizes}
            setShowAllSizes={setShowAllSizes}
          />
        )
      case 3:
        return (
          <ProductImagesStep
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        sizes: [],
        colors: [],
        billboardId: '',
        images: [],
        imageUrls: [],
        stockStatus: '',
        quantity: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData?.id) {
      loadOptions()
    }
  }, [initialData, isOpen]);

  console.log('Product Dialog - Initial Data:', initialData);
  console.log('Product Dialog - Form Data:', formData);
  console.log('Product Dialog - Options:', options);

  if (!options) {

    toast.error('Failed to load product options');
    return null;
  }

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="overflow-hidden shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] rounded-xl mx-10"
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
          {/* Progress Steps */}
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
              {renderStep(step)}
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
              onClick={step < 3 ? handleNextStep : handleSubmit}
              size="sm"
              className="min-w-[80px]"
              disabled={loading}
            >
              {step === 3 ? (loading ? 'Product Creating...' : 'Product Create') : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </AnimatedDialog>
  )
}