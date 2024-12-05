import { Button } from "./ui/button";
import { ShoppingCart, Store, Heart, Menu, X, Home, Gift, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [favorites, setFavorites] = useState({ items: [] });
  const [cart, setCart] = useState({ items: [] });
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  if (!isMounted) {
    return null;
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Billiard Store
          </span>
        </Link>

        {/* Navigation Links - Hidden on mobile, shown on md and up */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" className="relative rounded-full flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="ghost" className="relative rounded-full flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>For You</span>
            </Button>
          </Link>
          <Link to="/special">
            <Button variant="ghost" className="relative rounded-full flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Special</span>
            </Button>
          </Link>

        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/80 active:scale-95 transition-all duration-200"
              onClick={() => navigate('/favorites')}
            >
              <div className="relative">
                {favorites.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    {favorites.items.length}
                  </span>
                )}
                <Heart className="h-5 w-5" />
              </div>
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/80 active:scale-95 transition-all duration-200"
              onClick={() => navigate('/cart')}
            >
              <div className="relative">
                {cart.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 z-10 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
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
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 space-y-4">
          {/* Mobile Navigation */}
          <div className="relative rounded-full flex justify-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className=" flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            
            <Link to="/for-you">
              <Button variant="ghost" className=" flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>For You</span>
              </Button>
            </Link>
            <Link to="/special">
              <Button variant="ghost" className=" flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Special</span>
              </Button>
            </Link>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
              onClick={() => navigate('/favorites')}
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
              className="rounded-full hover:bg-primary/10 active:scale-95 transition-all duration-200"
              onClick={() => navigate('/cart')}
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
    </header>
  );
}
