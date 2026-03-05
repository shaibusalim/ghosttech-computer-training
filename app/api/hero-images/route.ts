import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public")
    const heroDir = path.join(publicDir, "hero")

    if (!fs.existsSync(heroDir)) {
      return new Response(JSON.stringify({ images: [] }), { status: 200 })
    }

    const files = fs.readdirSync(heroDir).filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f))
    const images = files.map((f) => `/hero/${encodeURIComponent(f)}`)

    return new Response(JSON.stringify({ images }), { status: 200 })
  } catch (error) {
    console.error("[hero-images]", error)
    return new Response(JSON.stringify({ images: [] }), { status: 500 })
  }
}
