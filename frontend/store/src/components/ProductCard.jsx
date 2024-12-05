import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProductCard({ product }) {
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
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/4] overflow-hidden">
        <img
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
              onClick={() => addToFavorites(product)}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant={product.inStock ? "default" : "ghost"}
              size="icon"
              className={`rounded-full ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
