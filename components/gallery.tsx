"use client"

import React, { useMemo, useState } from "react"

type ImageItem = { src: string; caption?: string }

type GalleryProps = {
  images: ImageItem[]
  perPage?: number
}

export default function Gallery({ images, perPage = 12 }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const total = images.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const pageItems = useMemo(() => {
    const start = (page - 1) * perPage
    return images.slice(start, start + perPage)
  }, [images, page, perPage])

  function openAt(i: number) {
    setSelectedIndex(i)
  }

  function close() {
    setSelectedIndex(null)
  }

  function prev() {
    if (selectedIndex == null) return
    setSelectedIndex((selectedIndex - 1 + total) % total)
  }

  function next() {
    if (selectedIndex == null) return
    setSelectedIndex((selectedIndex + 1) % total)
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pageItems.map((item, idx) => {
          const globalIndex = (page - 1) * perPage + idx
          return (
            <button
              key={item.src}
              onClick={() => openAt(globalIndex)}
              className="overflow-hidden rounded-lg border border-primary/20 block relative group"
              aria-label={`Open image ${item.caption ?? item.src}`}
            >
                  <div className="relative w-full aspect-[4/3] bg-muted">
                    <img
                      src={item.src}
                      alt={item.caption ?? `Image ${globalIndex + 1}`}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 text-white text-xs p-2">
                  {item.caption}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border"
            disabled={page === 1}
          >
            Prev
          </button>
          <div className="text-sm text-foreground/70">Page {page} of {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded border"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedIndex != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-5xl w-full">
            <button onClick={close} className="absolute top-2 right-2 z-50 rounded-full bg-white/90 p-2 text-sm">Close</button>
            <button onClick={prev} className="absolute left-2 top-1/2 z-50 rounded-full bg-white/80 p-2">Prev</button>
            <button onClick={next} className="absolute right-2 top-1/2 z-50 rounded-full bg-white/80 p-2">Next</button>

            <div className="w-full h-[80vh] flex items-center justify-center">
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].caption ?? `Image ${selectedIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
                loading="eager"
              />
            </div>
            {images[selectedIndex].caption && (
              <div className="mt-2 text-center text-sm text-foreground/80">{images[selectedIndex].caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
