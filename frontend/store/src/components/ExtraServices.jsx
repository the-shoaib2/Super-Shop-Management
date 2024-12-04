import { Truck, CreditCard, RotateCcw, HeadphonesIcon, Gift, Shield, Clock, Percent } from "lucide-react";
import { motion } from "framer-motion";

export function ExtraServices() {
  const services = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders over ৳2000",
      color: "bg-blue-100"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Multiple payment methods accepted",
      color: "bg-green-100"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "bg-purple-100"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Round the clock customer service",
      color: "bg-yellow-100"
    },
    {
      icon: Gift,
      title: "Special Offers",
      description: "Regular discounts & promotions",
      color: "bg-pink-100"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "100% secure checkout",
      color: "bg-indigo-100"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick order processing",
      color: "bg-orange-100"
    },
    {
      icon: Percent,
      title: "Loyalty Points",
      description: "Earn points on purchases",
      color: "bg-teal-100"
    }
  ];

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-xl p-6 shadow-lg"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Extra Services</h2>
            <p className="text-muted-foreground text-sm">Enhancing your shopping experience with premium services</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${service.color} rounded-lg p-4 hover:shadow-md transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300" />
                    <service.icon className="w-6 h-6 text-primary relative z-10" />
                  </div>
                  <h3 className="font-semibold text-sm text-primary">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block bg-primary/10 rounded-xl p-4"
            >
              <p className="text-sm font-medium text-primary mb-2">Need Special Assistance?</p>
              <button className="bg-primary text-primary-foreground text-xs px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
