import React from "react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Registration Submitted</h1>
        <p className="text-foreground/70 mb-6">Thank you for registering. We will contact you with payment instructions and the class schedule.</p>
        <div className="space-x-3">
          <Link href="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Back to Home</Link>
          <Link href="/training-gallery" className="px-4 py-2 border rounded-md">View Gallery</Link>
        </div>
      </div>
    </main>
  )
}
