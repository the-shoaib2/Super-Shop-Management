import { useState } from 'react';
import { Billboard } from "@/components/Billboard";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { CustomerReviews } from "@/components/CustomerReviews";
import { ShopDetails } from "@/components/ShopDetails";
import { ExtraServices } from "@/components/ExtraServices";

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'cues', name: 'Cues' },
  { id: 'balls', name: 'Balls' },
  { id: 'tables', name: 'Tables' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'chalk', name: 'Chalk & Tips' }
];

const products = [
  {
    id: 1,
    name: "Professional Pool Cue",
    price: 299.99,
    category: "cues",
    image: "/images/cue1.jpg"
  },
  {
    id: 2,
    name: "Tournament Billiard Balls",
    price: 299.99,
    category: "balls",
    image: "/images/balls1.jpg"
  },
  {
    id: 3,
    name: "Premium Pool Table",
    price: 2499.99,
    category: "tables",
    image: "/images/table1.jpg"
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Billboard Section */}
      <div className="w-full mt-0">
        <Billboard />
      </div>
      
      {/* Categories Section */}
      <div className="container mx-auto px-8 py-12 space-y-16">
        <div className="bg-card shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-primary">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Extra Services Section */}
      <ExtraServices />

      {/* Shop Details Section */}
      <ShopDetails />
    </div>
  );
}
