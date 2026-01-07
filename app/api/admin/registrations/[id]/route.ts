import { getAdminDb } from "@/lib/firebase/admin"
import { cookies } from "next/headers"

type Params = { params: { id: string } }

export async function DELETE(_: Request, { params }: Params) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')?.value

    if (!adminAuth || adminAuth !== 'true') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 })
    }

    const db = getAdminDb()
    const docRef = db.collection("registrations").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    await docRef.delete()
    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Delete error:", error)
    return Response.json({ error: "Failed to delete", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
