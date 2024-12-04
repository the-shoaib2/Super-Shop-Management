import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const MotionDialogContent = motion(DialogContent);

const fadeIn = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

export function ProductDialog({ product, isOpen, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    toast.success("Added to cart!");
    onClose();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(!isFavorite ? "Added to favorites!" : "Removed from favorites!");
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <MotionDialogContent
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl overflow-hidden rounded-lg"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-2 mt-4">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {product.category}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="text-muted-foreground">
                    {product.description || "Professional grade billiard equipment crafted with premium materials for optimal performance."}
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    size="lg"
                    className="flex-1 rounded-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                    onClick={toggleFavorite}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        isFavorite ? "fill-primary text-primary" : ""
                      }`}
                    />
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 pt-4 mt-4 border-t">
                  <h4 className="font-semibold">Product Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Premium quality materials</li>
                    <li>• Professional grade construction</li>
                    <li>• 1 year manufacturer warranty</li>
                    <li>• Free returns within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>
          </MotionDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
