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

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Billboard />
      
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Featured Products */}
          <section>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Categories */}
          <section>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Cues', 'Balls', 'Tables', 'Accessories'].map((category) => (
                <div
                  key={category}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
                  onClick={() => window.location.href = '/products'}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
