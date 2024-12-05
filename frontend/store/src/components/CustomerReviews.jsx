import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Michael Chen",
    rating: 5,
    comment: "Best billiard equipment I've ever used. The quality is outstanding!",
    title: "Professional Player",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing customer service and fast shipping. Will definitely buy again!",
    title: "Pool Enthusiast",
    date: "2024-01-14"
  },
  {
    id: 3,
    name: "David Williams",
    rating: 5,
    comment: "The cues are perfectly balanced and the accessories are top-notch.",
    title: "Tournament Player",
    date: "2024-01-13"
  },
  {
    id: 4,
    name: "Emily Brown",
    rating: 5,
    comment: "Great selection of products. Found exactly what I was looking for!",
    title: "Casual Player",
    date: "2024-01-12"
  },
  {
    id: 5,
    name: "James Wilson",
    rating: 5,
    comment: "Exceptional quality and professional guidance. Highly recommended!",
    title: "Billiards Instructor",
    date: "2024-01-11"
  },
  {
    id: 6,
    name: "Lisa Martinez",
    rating: 5,
    comment: "The customer support team is incredibly helpful and knowledgeable.",
    title: "Regular Customer",
    date: "2024-01-10"
  },
  {
    id: 7,
    name: "Robert Taylor",
    rating: 5,
    comment: "Premium products at competitive prices. Can't ask for more!",
    title: "Club Owner",
    date: "2024-01-09"
  },
  {
    id: 8,
    name: "Amanda Lee",
    rating: 5,
    comment: "The online shopping experience was smooth and hassle-free.",
    title: "First-time Buyer",
    date: "2024-01-08"
  }
];

export function CustomerReviews() {
  return (
    <section className="py-6 bg-background/50 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg relative"
        >
          <div className="text-center mb-6 relative z-20">
            <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-sm">Real experiences from our valued customers</p>
          </div>

          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background/90 via-background/50 to-transparent z-10" />

          {/* Upper row - scrolling left to right */}
          <div className="mb-4 overflow-hidden relative">
            <motion.div
              animate={{ x: [0, -2880] }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }}
              className="flex gap-4 hover:pause-animation"
            >
              {[...reviews, ...reviews, ...reviews].map((review, index) => (
                <motion.div
                  key={review.id + "-upper-" + index}
                  className="flex-shrink-0 w-72 bg-white/5 backdrop-blur-md rounded-lg py-6 px-4 
                    shadow-[0_6px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] 
                    border border-white/10 transition-all duration-300 relative z-0 hover:z-20 
                    hover:scale-105 hover:bg-white/10"
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                    <p className="text-sm text-foreground/90 italic line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/5">
                        <span className="text-primary font-semibold text-sm">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Lower row - scrolling right to left */}
          <div className="overflow-hidden relative">
            <motion.div
              animate={{ x: [-2880, 0] }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }}
              className="flex gap-4 hover:pause-animation"
            >
              {[...reviews.reverse(), ...reviews, ...reviews].map((review, index) => (
                <motion.div
                  key={review.id + "-lower-" + index}
                  className="flex-shrink-0 w-72 bg-white/5 backdrop-blur-md rounded-lg py-6 px-4 
                    shadow-[0_6px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] 
                    border border-white/10 transition-all duration-300 relative z-0 hover:z-20 
                    hover:scale-105 hover:bg-white/10"
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                    <p className="text-sm text-foreground/90 italic line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/5">
                        <span className="text-primary font-semibold text-sm">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">{review.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
