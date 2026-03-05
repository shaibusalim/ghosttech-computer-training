import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { getAdminDb, getAdminStorageBucket } from "@/lib/firebase/admin"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin_auth")

    if (!adminAuth || adminAuth.value !== "true") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getAdminDb()
    const snapshot = await db.collection("gallery").orderBy("createdAt", "desc").get()

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>),
    }))

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
    const match = imageData.match(/^data:(?<mime>.+);base64,(?<data>.+)$/)
    if (!match || !match.groups) {
      return Response.json({ error: "Invalid image data" }, { status: 400 })
    }

    const { mime, data } = match.groups as { mime: string; data: string }
    const buffer = Buffer.from(data, "base64")

    // Basic size guard (10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return Response.json({ error: "File too large" }, { status: 400 })
    }

    const bucket = getAdminStorageBucket()
    
    if (!bucket.name) {
      console.error("[v0] Storage bucket is not configured or not found.")
      return Response.json({ error: "Storage bucket not configured. Please check your .env file." }, { status: 500 })
    }

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const timestamp = Date.now()
    const extension = mime.split("/")[1] || "jpg"
    const storagePath = `gallery/${safeTitle}-${timestamp}.${extension}`

    const file = bucket.file(storagePath)
    await file.save(buffer, {
      contentType: mime,
      public: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    })

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURI(storagePath)}`

    const db = getAdminDb()
    const docRef = await db.collection("gallery").add({
      title,
      description: description ?? "",
      category,
      imageUrl: publicUrl,
      storagePath,
      createdAt: new Date().toISOString(),
    })

    return Response.json(
      {
        id: docRef.id,
        title,
        description: description ?? "",
        category,
        imageUrl: publicUrl,
        storagePath,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return Response.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}

