import { AnimatedDialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogCloseButton } from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'
import { FiDollarSign, FiBox, FiTag, FiLayers } from 'react-icons/fi'

export default function ViewProductDialog({ isOpen, onClose, product }) {
  if (!product) return null;

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-2xl"
      className="overflow-hidden shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] rounded-xl"
    >
      <DialogHeader className="px-4 py-3 border-b">
        <DialogTitle className="text-lg font-semibold">
          Product Details
        </DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>

      <DialogContent className="p-0">
        <div className="grid grid-cols-2 divide-x">
          {/* Left side - Images */}
          <div className="p-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiDollarSign className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">৳{product.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiBox className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-3">
              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Colors</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.colors.map((color) => (
                      <div 
                        key={color.id}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100"
                      >
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-xs">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Sizes</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.sizes.map((size) => (
                      <span 
                        key={size.id}
                        className="px-2 py-1 rounded-full bg-gray-100 text-xs"
                      >
                        {size.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="px-4 py-3 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </AnimatedDialog>
  )
} 