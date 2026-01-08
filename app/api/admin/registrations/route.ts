import { cookies } from "next/headers"
import { getAdminDb } from "@/lib/firebase/admin"
import admin from "firebase-admin"

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')

    if (!adminAuth || adminAuth.value !== 'true') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getAdminDb()

    // Fetch all registrations ordered by creation date (newest first)
    const snapshot = await db.collection("registrations").orderBy("created_at", "desc").get()

    const registrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return Response.json({ registrations }, { status: 200 })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return Response.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
