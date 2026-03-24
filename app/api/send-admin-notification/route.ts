import { sendEmail, emailTemplates } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = "registration" } = body

    if (type === "payment") {
      const { full_name, email, payment_status, payment_amount } = body
      const amountText = payment_status === "partial" ? `Part payment received: GHS ${payment_amount}` : payment_status === "full" ? "Full payment received: GHS 700" : "No payment recorded"
      const html = emailTemplates.payment(full_name, payment_status, amountText)
      
      await sendEmail({
        to: email,
        subject: payment_status === "full" ? "✅ Payment Confirmed - Full Payment Received" : payment_status === "partial" ? "🟡 Payment Confirmed - Part Payment Received" : "ℹ️ Payment Status Update",
        html,
      })

      return Response.json({ success: true }, { status: 200 })
    }

    if (type === "approval") {
      const { full_name, email } = body
      const html = emailTemplates.approval(full_name)
      
      await sendEmail({
        to: email,
        subject: "🎉 Welcome to Gh0sT Tech - Registration Approved!",
        html,
      })

      return Response.json({ success: true }, { status: 200 })
    }

    // Default: New registration notification for admin
    const { full_name, email, phone_number, whatsapp_number, location, registration_id } = body

    if (!full_name || !email || !registration_id) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const html = emailTemplates.adminAlert({
        full_name,
        email,
        phone_number,
        whatsapp_number,
        location,
        registration_id,
      })
      
      await sendEmail({
        to: adminEmail,
        subject: `🚨 New Student Registration: ${full_name}`,
        html,
      })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[v0] Admin notification API error:", error)
    return Response.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
