import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

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

    const { id } = await context.params
    const { email, full_name } = await request.json()

    // Update the registration status to approved
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({ status: 'approved' })
      .eq('id', id)

    if (updateError) throw updateError

    // Send approval email
    try {
      const html = emailTemplates.approval(full_name)
      await sendEmail({
        to: email,
        subject: "🎉 Welcome to Gh0sT Tech - Registration Approved!",
        html,
      })
    } catch (emailError) {
      console.error("[v0] Approval email error (registration still approved):", emailError)
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error approving registration:", error)
    return Response.json({ error: "Failed to approve registration" }, { status: 500 })
  }
}
