import { Button } from "./ui/button";
import { ShoppingCart, Store, Search, Heart, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [favorites, setFavorites] = useState({ items: [] });
  const [cart, setCart] = useState({ items: [] });
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFavorites = () => {
      const storedFavorites = localStorage.getItem('favorites');
      return storedFavorites ? JSON.parse(storedFavorites) : { items: [] };
    };

    const fetchCart = () => {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : { items: [] };
    };

    setFavorites(fetchFavorites());
    setCart(fetchCart());
    setIsMounted(true);
  }, []);

  const handleCartClick = () => {
    if (cart.items.length > 0) {
      window.location.href = '/cart';
    } else {
      toast.error('Your cart is empty', {
        duration: 2000,
      });
    }
  };

  const handleFavoritesClick = () => {
    if (favorites.items.length > 0) {
      window.location.href = '/favorites';
    } else {
      toast.error('No favorites yet', {
        duration: 2000,
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Billiard Store
            </span>
          </a>

          {/* Search Bar - Hidden on mobile, shown on md and up */}
          <div className="hidden md:flex items-center relative max-w-md flex-1 mx-6">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-full border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
              onClick={handleFavoritesClick}
            >
              <div className="relative">
                {favorites.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    {favorites.items.length}
                  </span>
                )}
                <Heart className={`h-5 w-5 transition-colors ${
                  favorites.items.length > 0 ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'
                }`} />
              </div>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
              onClick={handleCartClick}
            >
              <div className="relative">
                {cart.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </div>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-full border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
                onClick={handleFavoritesClick}
              >
                <div className="relative">
                  {favorites.items.length > 0 && (
                    <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                      {favorites.items.length}
                    </span>
                  )}
                  <Heart className={`h-5 w-5 transition-colors ${
                    favorites.items.length > 0 ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'
                  }`} />
                </div>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
                onClick={handleCartClick}
              >
                <div className="relative">
                  {cart.items.length > 0 && (
                    <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                  <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
