import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import crypto from "crypto"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature")
  const body = await request.text()

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex")

  if (hash !== signature) {
    return Response.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === "charge.success") {
    const { reference, amount, metadata } = event.data
    const { registrationId } = metadata

    try {
      // 1. Update registration status in database
      const { data: updatedData, error: updateError } = await supabaseAdmin
        .from('registrations')
        .update({
          payment_status: amount === 70000 ? "full" : "partial",
          payment_amount: amount / 100, // convert from kobo to GHS
          payment_reference: reference,
          payment_method: "paystack",
          payment_confirmed_at: new Date().toISOString(),
          status: amount === 70000 ? "awaiting_admin_approval" : "pending_payment"
        })
        .eq('id', registrationId)
        .select('email, full_name')
        .single()

      if (updateError) throw updateError

      // 2. Send email confirmation to student
      if (updatedData) {
        try {
          const paymentStatus = amount === 70000 ? "full" : "partial"
          const amountText = amount === 70000 ? "Full payment received: GHS 700" : `Part payment received: GHS ${amount / 100}`
          const html = emailTemplates.payment(updatedData.full_name, paymentStatus, amountText)
          
          await sendEmail({
            to: updatedData.email,
            subject: paymentStatus === "full" ? "✅ Payment Confirmed - Full Payment Received" : "🟡 Payment Confirmed - Part Payment Received",
            html,
          })
        } catch (emailError) {
          console.error("Error sending payment confirmation email:", emailError)
        }
      }

      return Response.json({ status: "success" }, { status: 200 })
    } catch (error) {
      console.error("Error updating registration payment status:", error)
      return Response.json({ error: "Failed to update payment status" }, { status: 500 })
    }
  }

  return Response.json({ status: "ignored" }, { status: 200 })
}
