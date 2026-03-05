import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { getAdminDb, getAdminStorageBucket } from "@/lib/firebase/admin"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin_auth")

    if (!adminAuth || adminAuth.value !== "true") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const db = getAdminDb()
    const docRef = db.collection("gallery").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return Response.json({ error: "Gallery item not found" }, { status: 404 })
    }

    const data = doc.data() as { storagePath?: string } | undefined
    const storagePath = data?.storagePath

    if (storagePath) {
      try {
        const bucket = getAdminStorageBucket()
        await bucket.file(storagePath).delete({ ignoreNotFound: true })
      } catch (storageError) {
        // Log but do not block deletion of Firestore doc
        console.error("Failed to delete gallery image from storage:", storageError)
      }
    }

    await docRef.delete()

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return Response.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}

