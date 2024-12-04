import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "John Smith",
    rating: 5,
    comment: "Best billiard equipment I've ever used. The quality is outstanding!",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "Professional Player"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing customer service and fast shipping. Will definitely buy again!",
    avatar: "https://i.pravatar.cc/150?img=2",
    title: "Pool Enthusiast"
  },
  {
    id: 3,
    name: "Michael Chen",
    rating: 5,
    comment: "The cues are perfectly balanced and the accessories are top-notch.",
    avatar: "https://i.pravatar.cc/150?img=3",
    title: "Tournament Player"
  },
  {
    id: 4,
    name: "Emily Davis",
    rating: 5,
    comment: "Great selection of products. Found exactly what I was looking for!",
    avatar: "https://i.pravatar.cc/150?img=4",
    title: "Casual Player"
  }
];

export function CustomerReviews() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{review.name}</h3>
                  <p className="text-sm text-muted-foreground">{review.title}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
