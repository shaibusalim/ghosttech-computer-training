import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutInstructor } from "@/components/about-instructor"
import { CoursesSection } from "@/components/courses-section"
import { RegistrationForm } from "@/components/registration-form"
import { ContactSection } from "@/components/contact-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section id="home" className="pt-24">
        <HeroSection />
      </section>
      <section id="about">
        <AboutInstructor />
      </section>
      <section id="courses">
        <CoursesSection />
      </section>
      <section id="registration" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Program</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <RegistrationForm />
        </div>
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <footer className="border-t border-border/30 bg-card/30 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-foreground/70">
          <p>&copy; 2026 Gh0sT Tech. All rights reserved.</p>
          <p className="text-sm mt-2">Practical Computer Training in Tamale, Ghana</p>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  )
}
