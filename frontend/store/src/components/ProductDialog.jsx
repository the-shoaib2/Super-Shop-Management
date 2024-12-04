import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Package, Shield, Truck } from "lucide-react";
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
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleAddToCart = () => {
    toast.success(
      `Added ${selectedQuantity} ${product.name}${selectedQuantity > 1 ? 's' : ''} to cart!`,
      {
        duration: 2000,
      }
    );
    onClose();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success(`Added ${product.name} to favorites!`, {
        icon: '❤️',
      });
    } else {
      toast('Removed from favorites', {
        icon: '💔',
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setSelectedQuantity(value);
    }
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
            className="max-w-3xl overflow-hidden rounded-lg"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-8 md:grid-cols-2 mt-6">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary backdrop-blur-sm rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                {/* Product Rating */}
                <div className="flex items-center gap-2 px-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(50+ Reviews)</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {product.category}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-primary">
                      ৳{product.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="text-muted-foreground">
                    {product.description || "Professional grade billiard equipment crafted with premium materials for optimal performance."}
                  </p>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max="10"
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                      className="w-20 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
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
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 pt-6 mt-6 border-t">
                  <h4 className="font-semibold">Product Features</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Premium Quality</p>
                        <p className="text-xs text-muted-foreground">Professional grade materials</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">1 Year Warranty</p>
                        <p className="text-xs text-muted-foreground">Manufacturer guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Free Returns</p>
                        <p className="text-xs text-muted-foreground">Within 30 days of purchase</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
