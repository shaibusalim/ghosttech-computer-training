"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutInstructor } from "@/components/about-instructor"
import { CoursesSection } from "@/components/courses-section"
import { RegistrationForm } from "@/components/registration-form"
import { ContactSection } from "@/components/contact-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <motion.section
        id="home"
        className="pt-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <HeroSection />
      </motion.section>
      <motion.section
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <AboutInstructor />
      </motion.section>
      <motion.section
        id="courses"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <CoursesSection />
      </motion.section>
      <motion.section
        id="registration"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Program</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <RegistrationForm />
        </div>
      </motion.section>
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ContactSection />
      </motion.section>
      <motion.footer
        className="border-t border-border/30 bg-card/30 py-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center text-foreground/70">
          <p>&copy; 2026 Gh0sT Tech. All rights reserved.</p>
          <p className="text-sm mt-2">Practical Computer Training in Tamale, Ghana</p>
        </div>
      </motion.footer>
      <FloatingWhatsApp />
    </div>
  )
}
