import { Heart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ProductDialog } from './ProductDialog';

export function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? 'Added to favorites!' : 'Removed from favorites!'
    );
  };

  return (
    <>
      <Card className="group overflow-hidden rounded-xl border-2 hover:border-primary/50 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {/* Quick Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? 'fill-primary text-primary' : 'text-gray-600'
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg"
              onClick={() => setIsDialogOpen(true)}
            >
              <Eye className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground capitalize">
              {product.category}
            </p>
            <h3 className="font-semibold text-lg truncate">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-6"
              onClick={() => {
                toast.success('Added to cart!');
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>

      <ProductDialog 
        product={product}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
