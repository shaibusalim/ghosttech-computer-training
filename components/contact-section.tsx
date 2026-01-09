"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react"

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Direct support during business hours",
    value: "0541120274",
    subtitle: "Mon-Fri: 8AM-6PM",
    link: "tel:0541120274",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "24/7 instant messaging support",
    value: "0209832978",
    subtitle: "Quick responses guaranteed",
    link: "https://wa.me/233209832978",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "For detailed inquiries and course information",
    value: "cybergh0st404@protonmail.com",
    subtitle: "Response within 24 hours",
    link: "mailto:cybergh0st404@protonmail.com",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Training center location",
    value: "Gurugu, Tamale, Ghana",
    subtitle: "By appointment",
    link: "https://maps.google.com/?q=Gurugu+Tamale+Ghana",
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
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
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
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <motion.div key={method.title} variants={itemVariants}>
                <Card
                  className={`border-primary/20 bg-gradient-to-br ${method.color} backdrop-blur-sm hover:border-primary/50 transition-colors duration-300 h-full group overflow-hidden`}
                >
                  <CardContent className="relative pt-8 text-center space-y-6">
                    <div className={`w-16 h-16 ${method.iconColor} mx-auto`}>
                      <Icon className="w-full h-full" strokeWidth={1.5} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-foreground/60 text-sm">{method.description}</p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      <p className={`text-primary font-bold font-mono ${
                        method.value.length > 20 ? 'text-sm' : 'text-lg'
                      }`}>
                        {method.value}
                      </p>
                      {method.subtitle && (
                        <p className="text-foreground/50 text-xs">{method.subtitle}</p>
                      )}
                    </motion.div>

                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group/btn"
                    >
                      <a href={method.link} target="_blank" rel="noopener noreferrer">
                        Contact
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
