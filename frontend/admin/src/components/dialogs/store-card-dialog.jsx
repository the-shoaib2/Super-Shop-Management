import { QRCodeSVG } from 'qrcode.react'
import { 
  AnimatedDialog, 
  DialogHeader, 
  DialogTitle, 
  DialogContent, 
  DialogFooter,
  DialogCloseButton 
} from '@/components/ui/animated-dialog'

export const StoreCardDialog = ({ isOpen, onClose, store }) => {
  return (
    <AnimatedDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Store Information</DialogTitle>
        <DialogCloseButton onClose={onClose} />
      </DialogHeader>
      
      <DialogContent className="space-y-4">
        {/* Store Details */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground">{store?.name}</h3>
          <p className="text-sm text-muted-foreground">{store?.description}</p>
        </div>
        
        {/* Store ID */}
        <div className="flex items-center justify-center space-x-2 bg-muted/50 rounded-md p-2">
          <span className="text-sm text-muted-foreground">Store ID:</span>
          <code className="font-mono text-sm bg-background px-2 py-0.5 rounded">
            {store?.storeId}
          </code>
        </div>
        
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <QRCodeSVG 
            value={`${window.location.origin}/store/${store?.storeId}`}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
        </div>
        
        {/* Store Status */}
        <div className="flex items-center justify-center space-x-2">
          <span className={`h-2.5 w-2.5 rounded-full ${store?.active ? 'bg-green-500' : 'bg-destructive'}`} />
          <span className="text-sm text-muted-foreground">
            {store?.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {/* Instructions */}
        <p className="text-sm text-muted-foreground text-center">
          Scan this QR code to view store details
        </p>
      </DialogContent>
      
      <DialogFooter>
        <button
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
          onClick={() => {
            // Download QR code logic
          }}
        >
          Download QR
        </button>
      </DialogFooter>
    </AnimatedDialog>
  )
} 