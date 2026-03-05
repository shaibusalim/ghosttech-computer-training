"use client"

import { RegistrationForm } from "@/components/registration-form"
import { motion } from "framer-motion"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.section
        className="pt-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <main className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Program</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>
            <RegistrationForm />
          </div>
        </main>
      </motion.section>
    </div>
  )
}
