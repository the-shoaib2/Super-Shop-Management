import { Billboard } from "@/components/Billboard";
import { ProductCard } from "@/components/ProductCard";

const featuredProducts = [
  {
    id: 1,
    name: "Professional Pool Cue",
    description: "High-quality maple wood pool cue with precision tip.",
    price: 199.99,
    category: "Cues",
    image: "https://images.unsplash.com/photo-1610726343776-cae3ec70afd7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Tournament Billiard Balls",
    description: "Professional grade phenolic resin ball set.",
    price: 299.99,
    category: "Balls",
    image: "https://images.unsplash.com/photo-1626776876729-bab4991b7991?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Premium Pool Table",
    description: "Slate bed pool table with Italian cloth.",
    price: 2499.99,
    category: "Tables",
    image: "https://images.unsplash.com/photo-1609726121380-243fcdbb1935?q=80&w=2070&auto=format&fit=crop"
  }
];

const categories = [
  { name: 'Cues', image: 'https://images.unsplash.com/photo-1610726343776-cae3ec70afd7?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Balls', image: 'https://images.unsplash.com/photo-1626776876729-bab4991b7991?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Tables', image: 'https://images.unsplash.com/photo-1609726121380-243fcdbb1935?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1609726494499-27d3e942456c?q=80&w=2070&auto=format&fit=crop' }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Billboard Section */}
      <div className="w-full mt-16">
        <Billboard />
      </div>
      
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Products */}
        <section>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center md:text-left">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-center md:text-left">
                Discover our handpicked selection of premium billiard equipment
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-center md:text-left">
                Shop by Category
              </h2>
              <p className="text-muted-foreground text-center md:text-left">
                Browse our extensive collection by category
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  onClick={() => window.location.href = '/products'}
                  className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 group-hover:to-black/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="transform transition-all duration-300 group-hover:translate-y-[-8px]">
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-white/80 mt-1 text-sm opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Click to explore →
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
