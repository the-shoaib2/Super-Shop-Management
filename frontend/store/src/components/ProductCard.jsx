import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { ProductDialog } from './ProductDialog';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = () => {
    toast.success(`Added ${product.name} to cart`);
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite 
        ? `Removed ${product.name} from favorites`
        : `Added ${product.name} to favorites`
    );
  };

  return (
    <>
      <Card className="group overflow-hidden rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="p-0">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            
            <img
              src={product.image}
              alt={product.name}
              className={`
                w-full h-full object-cover transition-all duration-500
                group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:text-primary transition-colors duration-200"
                onClick={() => setIsDialogOpen(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className={`h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 
                  ${isFavorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                onClick={handleFavoriteClick}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3">
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-primary">
                ${product.price.toLocaleString()}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        product={product}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export { ProductCard };
