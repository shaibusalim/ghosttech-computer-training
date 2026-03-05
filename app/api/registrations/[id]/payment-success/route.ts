import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const db = getAdminDb()
    const docRef = db.collection("registrations").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    await docRef.update({
      payment_status: "full",
      status: "awaiting_admin_approval",
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating registration payment status:", error)
    return Response.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}

