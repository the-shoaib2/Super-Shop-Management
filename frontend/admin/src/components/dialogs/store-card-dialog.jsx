import { QRCodeSVG } from 'qrcode.react'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export const StoreCardDialog = ({ isOpen, onClose, store }) => {
  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `store-${store?.storeId}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Store Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
              id="qr-code"
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
        </div>
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleDownloadQR}>
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 