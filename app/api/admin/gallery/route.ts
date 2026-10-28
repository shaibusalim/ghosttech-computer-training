import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
}

export async function GET() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { data: items, error } = await supabaseAdmin
      .from('gallery')
      .select('*')
      .order('createdat', { ascending: false })

    if (error) throw error

    return Response.json({ items }, { status: 200 })
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return Response.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { title, description, category, imageData } = (await request.json()) as {
      title?: string
      description?: string
      category?: string
      imageData?: string
    }

    if (typeof title !== "string" || typeof category !== "string" || typeof imageData !== "string" || !title.trim() || !category.trim() || title.length > 200 || category.length > 100) {
      return Response.json({ error: "Missing or invalid fields" }, { status: 400 })
    }

    // imageData is expected as data:<mime>;base64,<payload> with an allow-listed raster image type
    const match = imageData.match(/^data:([a-z]+\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/)
    if (!match) {
      return Response.json({ error: "Invalid image data" }, { status: 400 })
    }

    const mime = match[1]
    const extension = ALLOWED_IMAGE_TYPES[mime]
    if (!extension) {
      return Response.json({ error: "Unsupported image type" }, { status: 400 })
    }
    const data = match[2]
    const buffer = Buffer.from(data, "base64")

    // Basic size guard (10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large" }, { status: 400 })
    }

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image"
    const timestamp = Date.now()
    const storagePathRaw = `gallery/${safeTitle}-${timestamp}.${extension}`

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('gallery')
      .upload(storagePathRaw, buffer, {
        contentType: mime,
        cacheControl: "31536000",
        upsert: false
      })

    if (storageError || !storageData) {
      console.error("[v0] Storage upload error:", storageError)
      return Response.json({ error: "Failed to upload image" }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('gallery')
      .getPublicUrl(storageData.path)

    const publicUrl = publicUrlData.publicUrl

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('gallery')
      .insert([{
        title,
        description: description ?? "",
        category,
        imageurl: publicUrl,
        storagepath: storageData.path,
        createdat: new Date().toISOString(),
      }])
      .select()

    if (dbError) throw dbError

    const docRef = dbData[0]

    return Response.json(
      {
        id: docRef.id,
        title,
        description: description ?? "",
        category,
        imageUrl: publicUrl,
        storagePath: storageData.path,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return Response.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}

