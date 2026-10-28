/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow Next.js to optimize local images and serve modern formats
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cchdhxvqfsmyktljtyaq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "img-src 'self' data: blob: https://cchdhxvqfsmyktljtyaq.supabase.co",
      `style-src 'self' 'unsafe-inline'${isProd ? " https://fonts.googleapis.com" : ""}`,
      `font-src 'self' data:${isProd ? " https://fonts.gstatic.com" : ""}`,
      `script-src 'self' https://va.vercel-scripts.com${isProd ? " 'unsafe-inline'" : " 'unsafe-inline' 'unsafe-eval'"}`,
      "media-src 'self'",
      "object-src 'none'",
      `connect-src 'self' ${isProd ? "" : "ws: wss: blob:"} https://api.paystack.co https://cchdhxvqfsmyktljtyaq.supabase.co`,
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join('; ')
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
        ],
      },
    ]
  },
}

export default nextConfig
