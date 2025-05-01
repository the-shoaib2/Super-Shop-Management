import { FiUpload, FiImage, FiX, FiLink, FiStar } from 'react-icons/fi'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { ImagePreview } from '../shared/ImagePreview'
import { ImageUrlInputs } from '@/components/ui/Image-url-inputs'
import ImageUploadProgress from '@/components/ui/Image-upload-progress'
import PropTypes from 'prop-types'
import React from 'react'

export const ProductImagesStep = ({ 
  formData = { images: [], imageUrls: [] }, 
  setFormData, 
  handleImageUpload, 
  removeImage
}) => {
  const handleUrlsChange = React.useCallback((newUrls) => {
    if (setFormData) {
      setFormData(prev => ({
        ...prev,
        imageUrls: newUrls
      }))
    }
  }, [setFormData])

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newImages = Array.from(formData.images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  }

  const setMainImage = (index) => {
    if (index === 0) return; // Already main image

    const newImages = Array.from(formData.images);
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);

    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  }

  // Check if any images or URLs are added
  const hasImages = formData.images.length > 0 || (formData.imageUrls?.length || 0) > 0

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Side - File Upload */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-sm font-medium">Upload Images</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Upload up to 5 images</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
                {formData.images.length}/5
              </span>
            </div>

            {formData.images.length === 0 ? (
              <div className="space-y-4">
                <label className="w-full max-w-[100px] aspect-square rounded-lg border-2 border-dashed 
                  flex flex-col items-center justify-center cursor-pointer mx-auto
                  hover:border-primary hover:bg-primary/5 group transition-all"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  
                  <div className="text-center p-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center mb-1.5 mx-auto
                      group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <FiUpload className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-[11px] font-medium text-gray-700 group-hover:text-primary transition-colors">
                      Upload Images
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      Max 5 images
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="product-images" direction="horizontal">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef} 
                      className="grid grid-cols-2 gap-2"
                    >
                      {formData.images.map((image, index) => (
                        <Draggable key={index} draggableId={`image-${index}`} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative group"
                            >
                              <ImagePreview
                                image={image}
                                index={index}
                                onRemove={removeImage}
                              />
                              {image.uploading && (
                                <ImageUploadProgress progress={image.progress} />
                              )}
                              {index !== 0 && (
                                <button 
                                  onClick={() => setMainImage(index)}
                                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 
                                    opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Set as main image"
                                >
                                  <FiStar className="w-4 h-4 text-yellow-500" />
                                </button>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {formData.images.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed 
                          flex flex-col items-center justify-center cursor-pointer
                          hover:border-primary hover:bg-primary/5 group transition-all"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <FiUpload className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-1" />
                          <span className="text-[10px] text-muted-foreground group-hover:text-primary">
                            Add More
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Right Side - Image URLs */}
          <div>
            <ImageUrlInputs 
              urls={formData.imageUrls || []} 
              onChange={handleUrlsChange}
            />
          </div>
        </div>

        {/* Guidelines - Only show when no images or URLs are added */}
        {!hasImages && (
          <div className="rounded-md bg-muted/40 p-2.5 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex-shrink-0 flex items-center justify-center">
                <FiImage className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Image Guidelines</h4>
                <ul className="text-muted-foreground space-y-0.5 text-[11px]">
                  <li>• First image will be the main product image</li>
                  <li>• Maximum file size: 5MB per image</li>
                  <li>• Best size: 1000x1000px (square)</li>
                  <li>• Formats: JPG, PNG</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ProductImagesStep.propTypes = {
  formData: PropTypes.shape({
    images: PropTypes.array.isRequired,
    imageUrls: PropTypes.array
  }),
  setFormData: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired
}