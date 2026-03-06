/* Fully client-side, animated training gallery sourced from Firestore `gallery` collection. */
"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "installation", label: "Installation" },
  { id: "virus-removal", label: "Virus Removal" },
  { id: "hardware", label: "Hardware" },
  { id: "classroom", label: "Classroom" },
] as const

type CategoryId = (typeof CATEGORIES)[number]["id"]

type GalleryItem = {
  id: string
  title: string
  description: string
  category: CategoryId | string
  imageUrl: string
  createdAt?: string
}

export default function TrainingGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('createdat', { ascending: false })

        if (error) throw error

        const mapped: GalleryItem[] = data.map((item) => ({
          id: item.id,
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          category: (item.category as CategoryId) ?? "installation",
          imageUrl: item.imageurl ?? "",
          createdAt: item.createdat,
        }))
        setItems(mapped)
        setError(null)
      } catch (err) {
        console.error("Failed to load gallery", err)
        setError("Unable to load gallery at the moment.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items
    return items.filter((item) => item.category === activeCategory)
  }, [items, activeCategory])

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>
      </div>
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-10 text-center">
          <p className="inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
            Training Gallery
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold">Real Practical Sessions from Gh0sTTech</h1>
          <p className="mt-3 text-sm md:text-base text-foreground/70 max-w-2xl mx-auto">
            A look inside our hands-on IT and system engineering program — real PCs, real repairs, real students
            building real skills.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs md:text-sm transition-colors",
                activeCategory === cat.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-card/60 text-foreground/70 hover:border-primary/60 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content states */}
        {loading && (
          <div className="flex justify-center py-16 text-sm text-foreground/60">
            Loading gallery...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
            {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-8 text-center text-sm text-foreground/70">
            No images yet in this category. Upload photos from the admin dashboard to populate the gallery.
          </div>
        )}

        {/* Masonry-like grid */}
        <div className="mt-4 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedId(item.id)}
                className="group relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
              >
                <div className="relative w-full overflow-hidden">
                  <div className="relative w-full">
                    <div className="relative w-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={800}
                        height={600}
                        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  {/* Enhanced overlay for better text contrast */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-left z-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {CATEGORIES.find((c) => c.id === item.category)?.label ?? "Gallery"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white drop-shadow-md">
                    {item.title}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Modal for selected image */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 12 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full bg-black">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  width={1280}
                  height={720}
                  className="h-auto w-full object-contain max-h-[70vh]"
                  loading="eager"
                />
              </div>
              <div className="flex flex-col gap-1 border-t border-primary/20 bg-slate-900 px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-bold text-white tracking-tight">{selectedItem.title}</p>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-full bg-primary/10 border border-primary/30 px-4 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    CLOSE
                  </button>
                </div>
                {selectedItem.description && (
                  <p className="text-sm text-slate-300/90 leading-relaxed max-w-2xl">
                    {selectedItem.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

