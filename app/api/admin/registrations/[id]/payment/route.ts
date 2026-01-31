import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"
import admin from "firebase-admin"

type PaymentStatus = "none" | "partial" | "full"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')

    if (!adminAuth) {
      return Response.json({ error: "No auth cookie" }, { status: 401 })
    }

    if (adminAuth.value !== 'true') {
      return Response.json({ error: "Invalid auth cookie" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { payment_status, payment_amount, email, full_name } = body as {
      payment_status: PaymentStatus
      payment_amount?: number
      email: string
      full_name: string
    }

    if (!payment_status || !["none", "partial", "full"].includes(payment_status)) {
      return Response.json({ error: "Invalid payment_status" }, { status: 400 })
    }

    if (payment_status === "partial" && (!payment_amount || payment_amount <= 0)) {
      return Response.json({ error: "Invalid payment_amount for partial payment" }, { status: 400 })
    }

    const db = getAdminDb()
    const docRef = db.collection("registrations").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {
      payment_status,
      payment_confirmed_at: new Date().toISOString(),
    }
    if (payment_status === "partial") {
      updateData.payment_amount = payment_amount
    } else {
      updateData.payment_amount = admin.firestore.FieldValue.delete()
    }

    await docRef.update(updateData)

    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-admin-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment",
          email,
          full_name,
          payment_status,
          payment_amount: payment_status === "partial" ? payment_amount : undefined,
        }),
      })

      if (!emailResponse.ok) {
        console.error("[v0] Payment email send failed, but payment status updated")
      }
    } catch (emailError) {
      console.error("[v0] Payment email error (status updated):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return Response.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
