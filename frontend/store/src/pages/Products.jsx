import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Search } from 'lucide-react';

const categories = ['All', 'Cues', 'Balls', 'Tables', 'Accessories'];

const products = [
  {
    id: 1,
    name: "Professional Pool Cue",
    description: "High-quality maple wood pool cue with precision tip, perfect for professional players. Features excellent balance and control.",
    price: 199.99,
    category: "Cues",
    image: "https://images.unsplash.com/photo-1610726343776-cae3ec70afd7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Tournament Billiard Balls",
    description: "Professional grade phenolic resin ball set with precise measurements and perfect roundness for tournament play.",
    price: 299.99,
    category: "Balls",
    image: "https://images.unsplash.com/photo-1626776876729-bab4991b7991?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Premium Pool Table",
    description: "Slate bed pool table with Italian cloth, professional cushions, and solid wood construction. Perfect for clubs and serious players.",
    price: 2499.99,
    category: "Tables",
    image: "https://images.unsplash.com/photo-1609726121380-243fcdbb1935?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Master Chalk Set",
    description: "Premium performance chalk set with superior grip and consistency. Includes 4 cubes of professional-grade chalk.",
    price: 19.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Luxury Cue Case",
    description: "Handcrafted leather cue case with premium stitching, plush interior, and secure locks. Holds up to 2 cues.",
    price: 79.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1611776246-c4add6822d7f?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Professional Bridge Stick",
    description: "Professional bridge stick with adjustable head and non-slip grip. Essential for those difficult shots.",
    price: 49.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1609726494563-a9821d3c8a0e?q=80&w=2070&auto=format&fit=crop"
  }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [selectedCategory]);

  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Our Products
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-full border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`
                  rounded-full px-6 transition-all duration-200
                  ${selectedCategory === category 
                    ? 'shadow-md hover:shadow-lg scale-105' 
                    : 'hover:border-primary/50 hover:text-primary'}
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-[300px] mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No products found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
