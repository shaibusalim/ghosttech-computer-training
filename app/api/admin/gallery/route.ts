import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin_auth")

    if (!adminAuth || adminAuth.value !== "true") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

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
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin_auth")

    if (!adminAuth || adminAuth.value !== "true") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, imageData } = (await request.json()) as {
      title?: string
      description?: string
      category?: string
      imageData?: string
    }

    if (!title || !imageData || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // imageData is expected as data:<mime>;base64,<payload>
    const match = imageData.match(/^data:(.+);base64,(.+)$/)
    if (!match) {
      return Response.json({ error: "Invalid image data" }, { status: 400 })
    }

    const mime = match[1]
    const data = match[2]
    const buffer = Buffer.from(data, "base64")

    // Basic size guard (10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large" }, { status: 400 })
    }

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const timestamp = Date.now()
    const extension = mime.split("/")[1] || "jpg"
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

