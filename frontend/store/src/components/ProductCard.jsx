import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { LazyImage } from "./LazyImage";
import { useState } from 'react';
import { 
  AnimatedDialog, 
  DialogHeader, 
  DialogContent, 
  DialogCloseButton,
  DialogFooter 
} from './ui/animated-dialog';

export function ProductCard({ product }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addToCart = (product) => {
    if (!product.inStock) {
      toast.error('Product is out of stock!');
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  const addToFavorites = (product) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || { items: [] };
    const existingItem = favorites.items.find(item => item.id === product.id);
    
    if (!existingItem) {
      favorites.items.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast.success('Added to favorites!');
    } else {
      toast('Already in favorites!', { icon: '⚠️' });
    }
  };

  return (
    <>
      <Card 
        className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative aspect-[4/4] overflow-hidden">
          <LazyImage
            src={product.image}
            alt={product.name}
            className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 
              ${!product.inStock ? 'opacity-75 grayscale' : ''}`}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isDiscount && (
              <Badge className="bg-red-500 text-xs">
                {product.discount}% OFF
              </Badge>
            )}
            <Badge className={`text-xs ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-base font-semibold truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold">
                ${product.isDiscount 
                  ? (product.price * (1 - product.discount / 100)).toFixed(2)
                  : product.price.toFixed(2)
                }
              </span>
              {product.isDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavorites(product);
                }}
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant={product.inStock ? "default" : "ghost"}
                size="icon"
                className={`rounded-full ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AnimatedDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="max-w-4xl"
      >
        <DialogHeader>
          <h2 className="text-xl font-bold">{product.name}</h2>
          <DialogCloseButton onClose={() => setIsDialogOpen(false)} />
        </DialogHeader>
        
        <DialogContent>
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Product Image */}
            <div className="aspect-[4/4] overflow-hidden rounded-lg">
              <LazyImage
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Product Details */}
            <div>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold">
                  ${product.isDiscount 
                    ? (product.price * (1 - product.discount / 100)).toFixed(2)
                    : product.price.toFixed(2)
                  }
                </span>
                {product.isDiscount && (
                  <span className="text-base text-muted-foreground line-through">
                    ${product.price}
                  </span>
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <Badge className={`text-sm ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {product.isDiscount && (
                  <Badge className="bg-red-500 text-sm ml-2">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> 
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => addToFavorites(product)}
                >
                  <Heart className="mr-2 h-5 w-5" /> 
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
        
        <DialogFooter>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => addToFavorites(product)}
          >
            <Heart className="mr-2 h-5 w-5" /> 
            Add to Favorites
          </Button>
          <Button 
            size="lg" 
            className=""
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-5 w-5" /> 
            Add to Cart
          </Button>
        </DialogFooter>
      </AnimatedDialog>
    </>
  );
}
