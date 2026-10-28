import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email-utils"
import { requireAdmin } from "@/lib/admin-auth"
import { isUuid } from "@/lib/payments"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    if (!isUuid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Recipient details come from the database, never from the request body.
    const { data: reg, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('email, full_name')
      .eq('id', id)
      .single()

    if (fetchError || !reg) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    // Update the registration status to approved
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'approved' })
      .eq('id', id)

    if (updateError) throw updateError

    // Send approval email
    try {
      const html = emailTemplates.approval(reg.full_name)
      await sendEmail({
        to: reg.email,
        subject: "🎉 Welcome to Gh0sT Tech - Registration Approved!",
        html,
      })
    } catch (emailError) {
      console.error("Approval email error (registration still approved):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error approving registration:", error)
    return Response.json({ error: "Failed to approve registration" }, { status: 500 })
  }
}
