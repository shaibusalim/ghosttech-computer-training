"use client"

import { motion } from "framer-motion"
import { Award, Heart, Zap } from "lucide-react"

export function AboutInstructor() {
  const features = [
    {
      icon: Award,
      title: "Expert Knowledge",
      description: "Proficient in hardware maintenance, software installation, and network setup",
    },
    {
      icon: Heart,
      title: "Passion for Teaching",
      description: "Dedicated to helping students master practical computer skills",
    },
    {
      icon: Zap,
      title: "Real-World Experience",
      description: "Brings industry practices and troubleshooting techniques to every class",
    },
  ]

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-5xl mx-auto">
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
            className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6"
          >
            <p className="text-sm font-semibold text-accent">Meet Your Instructor</p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Expert Training You Can Trust</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-sm group">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-3xl opacity-25 blur-3xl"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-full aspect-square rounded-3xl shadow-2xl overflow-hidden border border-accent/20"
              >
                <img src="/instructor-face.png" alt="Instructor" className="w-full h-full object-cover " />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-foreground/80 leading-relaxed"
            >
              With years of hands-on experience in computer hardware, software, and networking, our instructor brings
              practical knowledge directly to the classroom.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-foreground/80 leading-relaxed"
            >
              We believe in learning by doing. Every concept taught is backed by real-world applications and
              troubleshooting scenarios you'll encounter in professional environments.
            </motion.p>

            <div className="space-y-4 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/50 transition-all"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{feature.title}</h3>
                      <p className="text-foreground/70 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
