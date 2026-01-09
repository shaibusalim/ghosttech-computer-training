"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Code2, Database, Zap, Trophy, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

// Counter Component (no animation)
function Counter({ end }: { end: number }) {
  return <span>{end}</span>
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

// Scroll Indicator Component
function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
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
    </div>
  )
}

// Tech Stack Icons Component
function TechStackIcons() {
  const icons = [
    { Icon: Code2, label: "Web Dev" },
    { Icon: Database, label: "Networking" },
    { Icon: Terminal, label: "Hardware" },
    { Icon: Zap, label: "Systems" },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block">
      {icons.map(({ Icon, label }, idx) => {
        const angle = (idx / icons.length) * Math.PI * 2
        const x = Math.cos(angle) * 120
        const y = Math.sin(angle) * 120

        return (
          <div
            key={label}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
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
          <div
            key={i}
            className="w-10 h-10 rounded-full border-2 border-primary/50 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-semibold"
          >
            {avatar.name.charAt(0)}
          </div>
        ))}
      </div>
      <p className="text-sm text-foreground/70">Join our community of IT professionals</p>
    </div>
  )
}

export function HeroSection() {
  const typingWords = ["PC Hardware Assembly", "System Diagnostics", "Network Configuration", "Software Installation"]

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />

      {/* Tech stack floating icons */}
      <TechStackIcons />

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div className="space-y-8">
          {/* Badge */}
          <div>
            <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <p className="text-sm font-semibold text-primary">Professional IT Training Center</p>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
            Master <TypingEffect words={typingWords} />
          </h1>

          {/* Subheading */}
          <p className="text-xl text-foreground/70 text-balance leading-relaxed max-w-lg">
            Gain industry-recognized certifications in PC maintenance, Windows administration, and network troubleshooting.
            Learn from certified IT professionals with enterprise experience in Tamale, Gurugu, Ghana.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="#registration" className="w-full sm:w-auto">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg group shadow-lg shadow-primary/30">
                Get Started <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="#contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 font-semibold py-6 text-lg bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-primary">
                <Counter end={500} />+
              </p>
              <p className="text-sm text-foreground/60">Graduates Placed in IT Roles</p>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-accent">
                <Counter end={15} />+
              </p>
              <p className="text-sm text-foreground/60">Years Combined Instructor Experience</p>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-primary">
                <Counter end={98} />%
              </p>
              <p className="text-sm text-foreground/60">Certification Success Rate</p>
            </div>
          </div>

          {/* Social proof with avatars */}
          <div>
            <SocialProofAvatars />
          </div>
        </div>

        {/* Right carousel with images */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Carousel className="w-full" plugins={[Autoplay({ delay: 3000 })]}>
              <CarouselContent>
                {["/img.png", "/img2.png", "/img3.png", "/img4.png"].map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square group">
                      {/* Image */}
                      <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
                        <img
                          src={src}
                          alt={`Gh0sT Tech Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      </div>

                      {/* Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-md rounded-lg p-3 border border-primary/30">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/70">Interactive Learning</span>
                          <Trophy className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
