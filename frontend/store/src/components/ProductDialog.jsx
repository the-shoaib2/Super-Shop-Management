import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Package, Shield, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const MotionDialogContent = motion(DialogContent);

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const features = [
  {
    icon: Package,
    title: "Premium Quality",
    description: "Professional grade materials"
  },
  {
    icon: Shield,
    title: "1 Year Warranty",
    description: "Manufacturer guarantee"
  },
  {
    icon: Truck,
    title: "Free Returns",
    description: "Within 30 days of purchase"
  }
];

export function ProductDialog({ product, isOpen, onClose }) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{ \"items\": [] }");
    return favorites.items.some(item => item.id === product?.id);
  });

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setSelectedQuantity(value);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{ \"items\": [] }");
    const existingItem = cart.items.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += selectedQuantity;
    } else {
      cart.items.push({ ...product, quantity: selectedQuantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart!");
    onClose();
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{ \"items\": [] }");
    
    if (isFavorite) {
      favorites.items = favorites.items.filter(item => item.id !== product.id);
      toast.success("Removed from favorites");
    } else {
      favorites.items.push(product);
      toast.success("Added to favorites!");
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
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
            className="max-w-3xl overflow-hidden rounded-lg p-0 sm:p-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Image Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative aspect-square md:aspect-auto md:h-full"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-t-lg md:rounded-lg"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary backdrop-blur-sm rounded-full">
                    {product.category}
                  </span>
                </div>
              </motion.div>

              {/* Product Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 md:p-0 space-y-6"
              >
                <div>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {product.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(50+ Reviews)</span>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-primary">
                      ৳{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      In Stock
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => selectedQuantity > 1 && setSelectedQuantity(q => q - 1)}
                        className="h-8 w-8"
                      >
                        -
                      </Button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selectedQuantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center p-1 border rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => selectedQuantity < 10 && setSelectedQuantity(q => q + 1)}
                        className="h-8 w-8"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 rounded-full"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button
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
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold">Product Features</h4>
                  <div className="grid gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <feature.icon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{feature.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </MotionDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
