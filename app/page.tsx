"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutInstructor } from "@/components/about-instructor"
import { FeaturesSection } from "@/components/features-section"
import { CoursesSection } from "@/components/courses-section"
import { CurriculumSection } from "@/components/curriculum-section"
import { WhoThisTraining } from "@/components/who-this-training"
import { ProgramOutcomes } from "@/components/program-outcomes"
import { NeedsProvideSection } from "@/components/needs-provide"
import { FaqSection } from "@/components/faq-section"
import { LocationSection } from "@/components/location-section"
import { PaymentInfo } from "@/components/payment-info"
import Gallery from "@/components/gallery"
import { ContactSection } from "@/components/contact-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { motion } from "framer-motion"

export default function Home() {
  const [previewImages, setPreviewImages] = useState(
    [
      { src: "/training%20images/photo_2026-03-04_01-00-58.jpg", caption: "Batch 1 hands-on session" },
      { src: "/training%20images/photo_2026-03-04_01-01-11.jpg", caption: "Hardware identification" },
      { src: "/training%20images/photo_2026-03-04_01-01-27.jpg", caption: "Networking basics lab" },
      { src: "/training%20images/photo_2026-03-04_01-01-37.jpg", caption: "System troubleshooting" },
    ]
  )

  useEffect(() => {
    // try to load captions.json from public/training images
    fetch("/training%20images/captions.json")
      .then((r) => {
        if (!r.ok) throw new Error("No captions")
        return r.json()
      })
      .then((data) => {
        const filenames = Object.keys(data)
        const items = filenames.map((filename) => ({
          src: `/training%20images/${encodeURIComponent(filename)}`,
          caption: data[filename].caption || filename
        }))
        // Randomly pick 4 images for the preview
        const shuffled = [...items].sort(() => 0.5 - Math.random())
        setPreviewImages(shuffled.slice(0, 4))
      })
      .catch(() => {
        // keep defaults
      })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <motion.section
        id="home"
        className="pt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-10%" }}
      >
        <HeroSection />
      </motion.section>
      <motion.section
        id="courses"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <CoursesSection />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <WhoThisTraining />
      </motion.section>

      <motion.section
        id="outcomes"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ProgramOutcomes />
      </motion.section>
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <FeaturesSection />
      </motion.section>
      <motion.section
        id="curriculum"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <CurriculumSection />
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
        id="gallery"
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Gallery Preview</h2>
            <p className="text-foreground/70">Snapshots from recent training sessions.</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Gallery images={previewImages} perPage={4} />
          </motion.div>

          <div className="text-center mt-6">
            <a href="/training-gallery" className="text-sm text-primary font-semibold">View full gallery →</a>
          </div>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <NeedsProvideSection />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <PaymentInfo />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <FaqSection />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <LocationSection />
      </motion.section>
      {/* Registration moved to a dedicated page at /register */}
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
