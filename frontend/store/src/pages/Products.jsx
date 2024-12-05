import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ProductDialog } from "@/components/ProductDialog";

const MotionDiv = motion.div;

const categories = [
  "All Products",
  "Cue Sticks",
  "Balls",
  "Tables",
  "Accessories",
  "Maintenance",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const products = [
  {
    id: 1,
    name: "Professional Pool Cue",
    description: "High-quality maple wood pool cue with precision tip, perfect for professional players. Features excellent balance and control.",
    price: 199.99,
    category: "Cue Sticks",
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

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredProducts.map((product) => (
          <MotionDiv
            key={product.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedProduct(product);
              setIsDialogOpen(true);
            }}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold truncate">{product.name}</h3>
                  <p className="text-white/80 text-sm mt-1">৳{product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">৳{product.price.toFixed(2)}</p>
              <p className="text-xs text-primary">{product.category}</p>
            </div>
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
        </MotionDiv>
      )}

      {/* Product Dialog */}
      <ProductDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
