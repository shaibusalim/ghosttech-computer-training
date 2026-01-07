"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Code2, Database, Zap, Trophy, Terminal } from "lucide-react"
import { useEffect, useState } from "react"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [end, duration])

  return <span>{count}</span>
}

// Typing Effect Component
function TypingEffect({ words }: { words: string[] }) {
  const [displayedText, setDisplayedText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < currentWord.length) {
            setDisplayedText(currentWord.slice(0, displayedText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        } else {
          if (displayedText.length > 0) {
            setDisplayedText(displayedText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )
    return () => clearTimeout(timer)
  }, [displayedText, wordIndex, isDeleting, words])

  return (
    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Particle Background Component (SSR-safe deterministic positions)
function ParticleBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => i)

  // Simple deterministic PRNG so server and client render the same initial positions
  const createRand = (seedInit: number) => {
    let seed = seedInit >>> 0
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 4294967296
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => {
        const rand = createRand(12345 + i * 97)
        const left = `${rand() * 100}%`
        const top = `${rand() * 100}%`
        const x1 = rand() * 100 - 50
        const x2 = rand() * 100 - 50
        const y1 = rand() * 100 - 50
        const y2 = rand() * 100 - 50
        const duration = 8 + rand() * 4

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            animate={{
              x: [x1, x2],
              y: [y1, y2],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left,
              top,
            }}
          />
        )
      })}
    </div>
  )
}

// Scroll Indicator Component
function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-sm text-foreground/60">Scroll to explore</span>
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </motion.div>
  )
}

// Tech Stack Floating Icons Component
function TechStackIcons() {
  const icons = [
    { Icon: Code2, label: "Web Dev", delay: 0 },
    { Icon: Database, label: "Networking", delay: 0.2 },
    { Icon: Terminal, label: "Hardware", delay: 0.4 },
    { Icon: Zap, label: "Systems", delay: 0.6 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(({ Icon, label, delay }, idx) => {
        const angle = (idx / icons.length) * Math.PI * 2
        const x = Math.cos(angle) * 120
        const y = Math.sin(angle) * 120

        return (
          <motion.div
            key={label}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            style={{
              left: "50%",
              top: "50%",
              x: x,
              y: y,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Social Proof Avatars Component
function SocialProofAvatars() {
  const avatars = [
    { name: "Ama Osei", role: "Graduate 2024" },
    { name: "Kwame Atta", role: "Graduate 2023" },
    { name: "Adwoa Yeboah", role: "Current Student" },
  ]

  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-3">
        {avatars.map((avatar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="w-10 h-10 rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-semibold"
          >
            {avatar.name.charAt(0)}
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-foreground/70"
      >
        500+ students trained
      </motion.p>
    </div>
  )
}

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const typingWords = ["Software Troubleshooting", "Networking", "Hardware Repair", "Troubleshooting"]

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />

      {/* Particle background */}
      <ParticleBackground />

      {/* Light rays effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating background blobs with parallax */}
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        style={{
          x: mousePosition.x * 20 - 10,
          y: mousePosition.y * 20 - 10,
        }}
        className="absolute top-10 left-5 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        style={{
          x: mousePosition.x * -15 + 10,
          y: mousePosition.y * -15 + 10,
        }}
        className="absolute bottom-10 right-5 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
      />

      {/* Tech stack floating icons */}
      <TechStackIcons />

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge with stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
              className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full hover:shadow-lg hover:shadow-primary/20 transition-shadow"
            >
              <p className="text-sm font-semibold text-primary">🎓 Professional Computer Training</p>
            </motion.div>
          </motion.div>

          {/* Main heading with gradient animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight"
          >
            Master <TypingEffect words={typingWords} />
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-foreground/70 text-balance leading-relaxed max-w-lg"
          >
            Hands-on training in Computer Hardware, Software & Networking. Learn from industry professionals with
            real-world experience in Tamale, Ghana.
          </motion.p>

          {/* CTA buttons with enhanced hover effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="#registration" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg group shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
                  Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </motion.div>
            </Link>
            <Link href="#contact" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 font-semibold py-6 text-lg bg-transparent"
                >
                  Learn More
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Animated stats with counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-4 pt-8"
          >
            <motion.div whileHover={{ y: -5 }} className="flex flex-col">
              <p className="text-3xl font-bold text-primary">
                <AnimatedCounter end={500} />+
              </p>
              <p className="text-sm text-foreground/60">Students Trained</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col">
              <p className="text-3xl font-bold text-accent">
                <AnimatedCounter end={10} />+
              </p>
              <p className="text-sm text-foreground/60">Years Experience</p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="flex flex-col">
              <p className="text-3xl font-bold text-primary">
                <AnimatedCounter end={95} />%
              </p>
              <p className="text-sm text-foreground/60">Success Rate</p>
            </motion.div>
          </motion.div>

          {/* Social proof with avatars */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <SocialProofAvatars />
          </motion.div>
        </motion.div>

        {/* Right image with parallax 3D effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-square group" style={{ perspective: "1000px" }}>
            {/* Glowing border animation */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                  "0 0 40px rgba(99, 102, 241, 0.6)",
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl opacity-30 blur-3xl"
            />

            {/* Main image with hover parallax */}
            <motion.div
              whileHover={{ scale: 1.08, rotateY: 5, rotateX: 5 }}
              transition={{ duration: 0.3 }}
              style={{
                rotateX: mousePosition.y * 10 - 5,
                rotateY: mousePosition.x * -10 + 5,
              }}
              className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border border-primary/20"
            >
              <img
                src="/img.png"
                alt="Gh0sT Tech Instructor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </motion.div>

            {/* Before/After slider overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md rounded-lg p-3 border border-primary/30"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">Interactive Learning</span>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}>
                  <Trophy className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
