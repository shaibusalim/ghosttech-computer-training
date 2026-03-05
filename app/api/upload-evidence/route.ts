import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filename, data } = body

    if (!filename || !data) {
      return new Response(JSON.stringify({ error: "Missing filename or data" }), { status: 400 })
    }

    // Basic validation
    const allowedExt = [".png", ".jpg", ".jpeg", ".webp", ".avif"]
    const ext = path.extname(filename).toLowerCase()
    if (!allowedExt.includes(ext)) {
      return new Response(JSON.stringify({ error: "Unsupported file type" }), { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    // Data is expected as data:<mime>;base64,aaaa...
    const match = data.match(/^data:(.+);base64,(.+)$/)
    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid data format" }), { status: 400 })
    }

    const base64 = match[2]
    const buffer = Buffer.from(base64, "base64")

    // limit file size to 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File too large" }), { status: 400 })
    }

    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`
    const filePath = path.join(uploadsDir, safeName)
    fs.writeFileSync(filePath, buffer)

    const publicPath = `/uploads/${encodeURIComponent(safeName)}`
    return new Response(JSON.stringify({ success: true, path: publicPath }), { status: 200 })
  } catch (error) {
    console.error("[upload-evidence]", error)
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 })
  }
}
