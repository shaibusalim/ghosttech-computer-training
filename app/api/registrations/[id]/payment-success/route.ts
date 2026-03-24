import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('email, full_name')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: "full",
        status: "awaiting_admin_approval",
      })
      .eq('id', id)

    if (updateError) throw updateError

    // Send payment confirmation email
    try {
      const html = emailTemplates.payment(doc.full_name, "full", "Full payment received: GHS 700")
      await sendEmail({
        to: doc.email,
        subject: "✅ Payment Confirmed - Full Payment Received",
        html,
      })
    } catch (emailError) {
      console.error("Error sending payment confirmation email:", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating registration payment status:", error)
    return Response.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}

