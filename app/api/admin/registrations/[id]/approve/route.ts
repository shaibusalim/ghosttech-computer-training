import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')

    if (!adminAuth) {
      return Response.json({ error: "No auth cookie" }, { status: 401 })
    }

    if (adminAuth.value !== 'true') {
      return Response.json({ error: "Invalid auth cookie" }, { status: 401 })
    }

    const db = getAdminDb()
    const { id } = await context.params
    const { email, full_name, course_selection } = await request.json()

    // Update the registration status to approved
    await db.collection("registrations").doc(id).update({
      status: "approved"
    })

    // Send approval email
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-admin-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name,
          course_selection,
          type: "approval"
        }),
      })

      if (!emailResponse.ok) {
        console.error("[v0] Approval email send failed, but registration was approved")
      }
    } catch (emailError) {
      console.error("[v0] Approval email error (registration still approved):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error approving registration:", error)
    return Response.json({ error: "Failed to approve registration" }, { status: 500 })
  }
}
