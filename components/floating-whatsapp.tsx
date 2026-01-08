"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 !transition-none"
      style={{ animation: 'none', transition: 'none', transform: 'none' }}
    >
      {isHovered && (
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold whitespace-nowrap shadow-lg">
          Chat with us!
        </div>
      )}

      <a
        href="https://wa.me/233209832978"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl cursor-pointer !transition-none"
        style={{ animation: 'none', transition: 'none', transform: 'none' }}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>
    </div>
  )
}
