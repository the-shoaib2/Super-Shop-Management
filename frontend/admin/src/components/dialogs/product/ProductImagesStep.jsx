import { FiUpload, FiImage, FiX } from 'react-icons/fi'
import { ImagePreview } from '../shared/ImagePreview'

export const ProductImagesStep = ({ 
  formData, 
  handleImageUpload, 
  removeImage 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-medium">Product Images</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload up to 5 product images</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md">
            {formData.images.length}/5
          </span>
        </div>
        
        {formData.images.length === 0 ? (
          // Show guidelines and upload button when no images
          <div className="space-y-4">
            <label className="w-full max-w-[140px] aspect-square rounded-lg border-2 border-dashed 
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
              
              <div className="text-center p-3">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-2 mx-auto
                  group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <FiUpload className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-gray-700 group-hover:text-primary transition-colors">
                  Upload Images
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Select up to 5 images
                </p>
              </div>
            </label>

            {/* Image Guidelines - only shown when no images */}
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
          </div>
        ) : (
          // Show image grid and small upload button when images exist
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {formData.images.map((image, index) => (
                <ImagePreview
                  key={index}
                  image={image}
                  index={index}
                  onRemove={removeImage}
                />
              ))}
              
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
          </div>
        )}
      </div>
    </div>
  )
} 