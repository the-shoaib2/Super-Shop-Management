import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [favorites, setFavorites] = useState({ items: [] });

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const removeFromFavorites = (itemId) => {
    const updatedItems = favorites.items.filter(item => item.id !== itemId);
    const updatedFavorites = { ...favorites, items: updatedItems };
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    toast.success('Removed from favorites');
  };

  const addToCart = (item) => {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : { items: [] };
    
    const existingItem = cart.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart');
  };

  if (favorites.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your favorites list is empty</h2>
          <p className="text-muted-foreground mb-4">Add some items to your favorites to see them here</p>
          <Button onClick={() => window.location.href = '/products'}>
            Explore Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Favorites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex flex-col">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-md mb-4"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => removeFromFavorites(item.id)}
              >
                <Heart className="w-5 h-5 fill-current" />
              </Button>
            </div>
            
            <h3 className="font-semibold mb-2">{item.name}</h3>
            <p className="text-muted-foreground mb-2">${item.price}</p>
            
            <Button
              className="mt-auto"
              onClick={() => addToCart(item)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
