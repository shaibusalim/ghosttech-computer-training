import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Gh0sT Tech | Practical Computer Training in Tamale",
  description:
    "Learn Computer Hardware, Software & Networking with hands-on practical training. Based in Tamale, Ghana.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logo.png",
      },
      {
        url: "/placeholder-logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Gh0sT Tech | Practical Computer Training in Tamale",
    description:
      "Hands-on Computer Hardware, Software & Networking training in Tamale. See our gallery and register for upcoming batches.",
    url: "https://yourdomain.example/",
    siteName: "Gh0sT Tech",
    type: "website",
    images: [
      {
        url: "/img.png",
        width: 1200,
        height: 630,
        alt: "Gh0sT Tech Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gh0sT Tech | Practical Computer Training in Tamale",
    description: "Hands-on Computer Hardware, Software & Networking training in Tamale. See our gallery and register for upcoming batches.",
    images: ["/training%20images/photo_2026-03-04_01-03-47.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased dark`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
