"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MessageCircle, MapPin } from "lucide-react"

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Reach out via phone",
    value: "0541120274",
    link: "tel:0541120274",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat with us directly",
    value: "0209832978",
    link: "https://wa.me/233209832978",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Office location",
    value: "Tamale – Gurugu, Ghana",
    link: "https://maps.google.com/?q=Tamale+Gurugu+Ghana",
    color: "from-red-500/20 to-red-500/5",
    iconColor: "text-red-500",
  },
]

export function ContactSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
          >
            <p className="text-sm font-semibold text-primary">Contact & Support</p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Have questions? Reach out to us through any of these channels. We're here to help!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card
                  className={`border-primary/20 bg-gradient-to-br ${method.color} backdrop-blur-sm hover:border-primary/50 transition-all duration-300 h-full group overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <CardContent className="relative pt-8 text-center space-y-6">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-16 h-16 ${method.iconColor} mx-auto`}
                    >
                      <Icon className="w-full h-full" strokeWidth={1.5} />
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-foreground/60 text-sm">{method.description}</p>
                    </div>

                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <p className="text-primary font-bold text-lg font-mono">{method.value}</p>
                    </motion.div>

                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group/btn"
                    >
                      <a href={method.link} target="_blank" rel="noopener noreferrer">
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          Contact
                        </motion.span>
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
