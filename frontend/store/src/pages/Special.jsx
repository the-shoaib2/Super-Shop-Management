import { useState } from 'react';
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Special() {
  const [specialProducts] = useState([
    {
      id: 1,
      name: "Premium Billiard Cue",
      price: 299.99,
      isDiscount: true,
      discount: 20,
      inStock: true,
      image: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Professional grade billiard cue with premium wood construction"
    },
    {
      id: 2,
      name: "Tournament Pool Ball Set",
      price: 199.99,
      isDiscount: true,
      discount: 15,
      inStock: false,
      image: "https://images.unsplash.com/photo-1610250845462-d8ba888e09dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Official tournament grade pool ball set with carrying case"
    },
    {
      id: 3,
      name: "Luxury Pool Table",
      price: 2999.99,
      isDiscount: true,
      discount: 25,
      inStock: false,
      image: "https://images.unsplash.com/photo-1609726494499-27d3e942456c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Professional slate pool table with Italian leather pockets"
    },
    {
      id: 4,
      name: "Premium Chalk Set",
      price: 29.99,
      isDiscount: false,
      discount: 10,
      inStock: true,
      image: "https://images.unsplash.com/photo-1609726494499-27d3e942456c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      description: "Professional grade chalk set for optimal cue performance"
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {specialProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} addToFavorites={addToFavorites} />
        ))}
      </div>
    </div>
  );
}
