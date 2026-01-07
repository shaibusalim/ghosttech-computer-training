"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold whitespace-nowrap shadow-lg"
          >
            Chat with us!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/233209832978"
        target="_blank"
        rel="noopener noreferrer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      >
        <motion.div animate={{ y: isHovered ? -2 : 0 }} transition={{ duration: 0.2 }}>
          <MessageCircle className="w-8 h-8 text-white" />
        </motion.div>
      </motion.a>
    </motion.div>
  )
}

import { AnimatePresence } from "framer-motion"
