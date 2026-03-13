"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Code2, Database, Zap, Terminal, CalendarDays } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { MAX_SEATS_PER_COHORT } from "@/lib/utils"
import batches from "@/data/batches.json"
// carousel removed — hero now uses background images

// Counter Component (animated count-up)
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(end * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [end])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
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
    <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Scroll Indicator Component
function ScrollIndicator() {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2 hidden md:flex">
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

  const [seatsRemaining, setSeatsRemaining] = useState<number | null>(null)
  const [seatsLoading, setSeatsLoading] = useState(true)
  const [seatsError, setSeatsError] = useState<string | null>(null)

  // Fix mobile 100vh issues by setting a CSS variable --vh to window.innerHeight * 0.01
  useEffect(() => {
    function setVh() {
      if (typeof window === "undefined") return
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener("resize", setVh)
    return () => window.removeEventListener("resize", setVh)
  }, [])

  // Fetch confirmed registrations to calculate remaining seats
  useEffect(() => {
    async function fetchSeats() {
      try {
        const { count, error } = await supabase
          .from("registrations")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")

        if (error) throw error

        const confirmedCount = count ?? 0
        const remaining = Math.max(0, MAX_SEATS_PER_COHORT - confirmedCount)
        setSeatsRemaining(remaining)
        setSeatsError(null)
      } catch (error) {
        console.error("Failed to load seat count", error)
        setSeatsError("Limited seats available")
      } finally {
        setSeatsLoading(false)
      }
    }

    fetchSeats()
  }, [])

  return (
    <section
      className="relative flex items-center justify-center px-4 py-8 md:py-20 bg-linear-to-b from-slate-950 via-slate-900 to-black overflow-visible"
      aria-label="Hero section"
      style={{ minHeight: "calc(var(--vh, 1vh) * 85)" }}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("/hero/photo_2026-03-04_01-30-34.jpg")' }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/10 pointer-events-none z-10" />

      {/* Subtle animated grid / particles */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08)_0,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[80px_80px]" />
      </div>

      {/* Tech stack floating icons */}
      <TechStackIcons />

      {/* Hanging Alert Banner */}
      <div 
        className="absolute top-4 md:top-0 left-0 right-0 z-50 w-[95%] sm:max-w-lg mx-auto flex flex-col items-center origin-top pointer-events-auto transition-transform hover:scale-[1.02] duration-300"
        style={{ animation: "swing-in-out 15s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite" }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes swing-in-out {
            0%, 5% { transform: translateY(-100%) rotateX(-90deg); opacity: 0; }
            10%, 90% { transform: translateY(0) rotateX(0deg); opacity: 1; }
            95%, 100% { transform: translateY(-100%) rotateX(-90deg); opacity: 0; }
          }
        `}} />
        
        {/* 'Strings' for the hanging effect */}
        <div className="flex justify-between w-[80%] sm:w-3/4 px-4 sm:px-8">
          <div className="w-[2px] h-6 sm:h-12 bg-linear-to-b from-primary/10 via-primary/50 to-primary shadow-sm shadow-primary/50" />
          <div className="w-[2px] h-6 sm:h-12 bg-linear-to-b from-primary/10 via-primary/50 to-primary shadow-sm shadow-primary/50" />
        </div>
        
        {/* The Card */}
        <div className="w-full bg-slate-950/90 backdrop-blur-xl border border-primary/40 rounded-2xl p-2.5 sm:p-4 shadow-2xl shadow-primary/20 flex flex-row items-center gap-2 sm:gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          
          <div className="bg-linear-to-br from-primary/20 to-accent/20 p-2 sm:p-3 rounded-xl shrink-0 border border-primary/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <CalendarDays className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-[13px] sm:text-base text-foreground leading-tight bg-clip-text text-transparent bg-linear-to-r from-white to-white/70 whitespace-normal break-words">April Batch Enrollment!</h3>
            <p className="text-[10px] sm:text-sm text-foreground/70 leading-tight mt-0.5 whitespace-normal break-words">Secure your spot for the practical training.</p>
          </div>
          
          <Link href="/register" className="shrink-0 z-10">
            <Button size="sm" className="bg-white hover:bg-white/90 text-black border-none text-[10px] sm:text-xs font-bold shadow-lg shadow-white/20 transition-all hover:scale-105 h-8 sm:h-9 px-3 sm:px-4 rounded-full flex items-center">
              Register <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl w-full grid grid-cols-1 gap-8 md:gap-12 items-center pb-12 md:pb-0 mt-20 md:mt-0">
        {/* Left content */}
        <div className="space-y-6 md:space-y-8">
          {/* Top badge row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
              <p className="text-[10px] sm:text-xs font-semibold text-primary">Professional IT Training Center</p>
            </div>
            {Array.isArray(batches) && batches.length > 0 && batches[0] && (
              <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
                <p className="text-[10px] sm:text-xs font-semibold text-accent">{batches[0].title} • {batches[0].dates}</p>
              </div>
            )}
          </div>

          {/* Main heading (clear value prop) */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            Gh0sTTech Practical IT &amp; System Engineering Program
          </h1>

          {/* Supporting subheading */}
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl">
            Gain job‑ready, hands‑on skills to assemble PCs, install Windows &amp; Office, and troubleshoot real faults.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Tamale • Gurugu
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Total fee GHS 700
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Deposit GHS 300 to reserve
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full bg-linear-to-r from-accent to-primary text-primary-foreground font-bold py-5 text-lg shadow-lg">
                Secure Your Seat <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link href="#curriculum" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 font-semibold py-5 text-lg">
                View Curriculum
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 md:pt-8 border-t border-primary/10">
            <div className="flex flex-col">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                <Counter end={120} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-sm text-foreground/60 uppercase tracking-tight">Students Trained</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl md:text-3xl font-bold text-accent">
                <Counter end={8} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-sm text-foreground/60 uppercase tracking-tight">Cohorts Completed</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl md:text-3xl font-bold text-primary">
                <Counter end={45} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-sm text-foreground/60 uppercase tracking-tight">Practical Sessions</p>
            </div>
          </div>

          {/* Seat counter */}
          <div className="mt-4">
            <p className="inline-flex items-center rounded-full bg-black/40 border border-primary/40 px-4 py-2 text-sm text-primary-foreground/90 backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {seatsLoading && "Calculating available seats..."}
              {!seatsLoading && seatsError && seatsError}
              {!seatsLoading && !seatsError && seatsRemaining != null && (
                <>
                  Only{" "}
                  <span className="mx-1 font-semibold text-accent">
                    {seatsRemaining}
                  </span>
                  seats remaining for this cohort
                </>
              )}
            </p>
          </div>

          {/* Social proof with avatars */}
          <div>
            <SocialProofAvatars />
          </div>
        </div>

        {/* carousel removed */}
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}
