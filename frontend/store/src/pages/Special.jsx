import { useState } from 'react';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Special() {
  const [specialProducts] = useState([
    {
      id: 1,
      name: "Premium Billiard Cue",
      price: 299.99,
      discount: 20,
      image: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Professional grade billiard cue with premium wood construction"
    },
    {
      id: 2,
      name: "Tournament Pool Ball Set",
      price: 199.99,
      discount: 15,
      image: "https://images.unsplash.com/photo-1610250845462-d8ba888e09dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Official tournament grade pool ball set with carrying case"
    },
    {
      id: 3,
      name: "Luxury Pool Table",
      price: 2999.99,
      discount: 25,
      image: "https://images.unsplash.com/photo-1609726494499-27d3e942456c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Professional slate pool table with Italian leather pockets"
    },
  ]);

  const addToCart = (product) => {
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
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-2">Special Offers</h1>
      <p className="text-muted-foreground text-center mb-8">Exclusive deals on premium billiard equipment</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-red-500">
                {product.discount}% OFF
              </Badge>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10"
                    onClick={() => addToFavorites(product)}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="rounded-full"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
