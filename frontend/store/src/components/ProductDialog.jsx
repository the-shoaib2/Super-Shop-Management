import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function ProductDialog({ product, isOpen, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">{product.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Free shipping</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full rounded-full" onClick={() => {}}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold">Product Details</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• High-quality materials</li>
                <li>• Professional grade</li>
                <li>• 1 year warranty</li>
                <li>• Free returns within 30 days</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
