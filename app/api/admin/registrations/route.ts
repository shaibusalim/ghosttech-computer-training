import { getAdminDb } from "@/lib/firebase/admin"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')?.value

    if (!adminAuth || adminAuth !== 'true') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getAdminDb()
    const snapshot = await db.collection("registrations").get()
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return Response.json({ registrations: items }, { status: 200 })
  } catch {
    return Response.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
