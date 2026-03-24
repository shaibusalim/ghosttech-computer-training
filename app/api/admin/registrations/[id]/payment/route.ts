import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

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

    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {
      payment_status,
      payment_confirmed_at: new Date().toISOString(),
    }
    if (payment_status === "partial") {
      updateData.payment_amount = payment_amount
    } else {
      updateData.payment_amount = null
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    try {
      const amountText = payment_status === "partial" ? `Part payment received: GHS ${payment_amount}` : payment_status === "full" ? "Full payment received: GHS 700" : "No payment recorded"
      const html = emailTemplates.payment(full_name, payment_status, amountText)
      
      await sendEmail({
        to: email,
        subject: payment_status === "full" ? "✅ Payment Confirmed - Full Payment Received" : payment_status === "partial" ? "🟡 Payment Confirmed - Part Payment Received" : "ℹ️ Payment Status Update",
        html,
      })
    } catch (emailError) {
      console.error("[v0] Payment email error (status updated):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return Response.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}
