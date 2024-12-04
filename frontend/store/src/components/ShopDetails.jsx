import { Clock, MapPin, Phone, Mail, ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function ShopDetails() {
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
            <h2 className="text-2xl font-bold mb-2">Super Shop Details</h2>
            <p className="text-muted-foreground text-sm">Your one-stop destination for quality products</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Opening Hours & Location Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Opening Hours</h3>
                  <p className="text-muted-foreground text-xs">Mon - Sat: 9:00 AM - 10:00 PM</p>
                  <p className="text-muted-foreground text-xs">Sunday: 10:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Location</h3>
                  <p className="text-muted-foreground text-xs">123 Shopping Avenue</p>
                  <p className="text-muted-foreground text-xs">Dhaka, Bangladesh</p>
                  <p className="text-muted-foreground text-xs">Near City Center Mall</p>
                </div>
              </div>
            </div>

            {/* Contact & Email Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Contact</h3>
                  <p className="text-muted-foreground text-xs">Phone: +880 1234-567890</p>
                  <p className="text-muted-foreground text-xs">Hotline: 16247 (24/7)</p>
                  <p className="text-muted-foreground text-xs">WhatsApp: +880 1234-567890</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Email Support</h3>
                  <p className="text-muted-foreground text-xs">info@supershop.com</p>
                  <p className="text-muted-foreground text-xs">support@supershop.com</p>
                  <p className="text-muted-foreground text-xs">business@supershop.com</p>
                </div>
              </div>
            </div>

            {/* Store Features Column */}
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-sm mb-2">Store Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">Air Conditioned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">Parking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">Wi-Fi Zone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">Prayer Room</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">CCTV Security</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground text-xs">Card Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
