import { AnimatedDialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogCloseButton } from '@/components/ui/animated-dialog'
import { Button } from '@/components/ui/button'
import { FiAlertTriangle } from 'react-icons/fi'

export default function DeleteProductDialog({ isOpen, onClose, onConfirm, product }) {
  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-md"
      className="overflow-hidden shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] rounded-xl"
    >
      <DialogHeader className="px-4 py-3 border-b">
        <DialogTitle className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <FiAlertTriangle className="w-5 h-5" />
          Delete Product
        </DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>

      <DialogContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-900">
            Are you sure you want to delete <span className="font-medium">{product?.name}</span>?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the product and remove all associated data.
          </p>

          {/* Product Preview */}
          <div className="mt-4 flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={product?.imageUrl || '/placeholder.png'} 
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {product?.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {product?.description}
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                ৳{product?.price}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogFooter className="px-4 py-3 border-t">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          className="w-full sm:w-auto"
        >
          Delete Product
        </Button>
      </DialogFooter>
    </AnimatedDialog>
  )
} 