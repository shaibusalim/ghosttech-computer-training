/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // allow Next.js to optimize local images and serve modern formats
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
