"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Contact", href: "#contact" },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleNavClick = () => setIsOpen(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 !transition-none ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border/50 py-3" : "bg-transparent py-6"
      }`}
      style={{ animation: 'none', transition: 'none' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="#home" className="flex items-center gap-2 group">
          <div className="w-26 h-16 relative">
            <Image
              src="/logo.png"
              alt="Gh0sT Tech Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg hidden sm:inline">Gh0sT Tech</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <button className="px-4 py-2 text-foreground/80 hover:text-foreground relative group">
                {item.label}
              </button>
            </Link>
          ))}
        </div>

        {/* CTA Button and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link href="#registration" className="hidden sm:block">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Register Now</Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-foreground transition-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/80 backdrop-blur-md transition-none">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="block px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
            <Link href="#registration" onClick={handleNavClick} className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
