import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email-utils"
import { requireAdmin } from "@/lib/admin-auth"
import { getCourseById } from "@/lib/courses-data"
import { isUuid } from "@/lib/payments"

type PaymentStatus = "none" | "partial" | "full"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    if (!isUuid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const { payment_status, payment_amount } = (body ?? {}) as {
      payment_status: PaymentStatus
      payment_amount?: number
    }

    if (!payment_status || !["none", "partial", "full"].includes(payment_status)) {
      return Response.json({ error: "Invalid payment_status" }, { status: 400 })
    }

    const amount = Number(payment_amount)
    if (payment_status === "partial" && (!Number.isFinite(amount) || amount <= 0)) {
      return Response.json({ error: "Invalid payment_amount for partial payment" }, { status: 400 })
    }

    // Recipient details & fee come from the database, never from the request body.
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('id, email, full_name, course_id, total_fee')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const totalFee = Number(doc.total_fee) || getCourseById(doc.course_id || "").totalFee

    const updateData: Record<string, unknown> = {
      payment_status,
      payment_confirmed_at: new Date().toISOString(),
      payment_amount: payment_status === "partial" ? amount : null,
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    try {
      const amountText =
        payment_status === "partial"
          ? `Part payment received: GHS ${amount}`
          : payment_status === "full"
            ? `Full payment received: GHS ${totalFee}`
            : "No payment recorded"
      const html = emailTemplates.payment(doc.full_name, payment_status, amountText)

      await sendEmail({
        to: doc.email,
        subject: payment_status === "full" ? "✅ Payment Confirmed - Full Payment Received" : payment_status === "partial" ? "🟡 Payment Confirmed - Part Payment Received" : "ℹ️ Payment Status Update",
        html,
      })
    } catch (emailError) {
      console.error("Payment email error (status updated):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return Response.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
