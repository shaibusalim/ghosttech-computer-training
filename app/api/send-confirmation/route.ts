import { sendEmail, emailTemplates } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, full_name, course_selection, backend_preference, required_deposit, phone_number, whatsapp_number, location } = body

    if (!email || !full_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const courseTitle = course_selection || "Tech Training Program"

    // 1. Send confirmation to student
    const studentEmailHTML = emailTemplates.registration(full_name, courseTitle, required_deposit, backend_preference)
    await sendEmail({
      to: email,
      subject: `Welcome to Gh0sT Tech! - ${courseTitle} Registration`,
      html: studentEmailHTML,
    })

    // 2. Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const adminEmailHTML = emailTemplates.adminAlert({
        full_name,
        email,
        course_selection: courseTitle,
        backend_preference,
        phone_number: phone_number || "Not provided",
        whatsapp_number: whatsapp_number || "Not provided",
        location: location || "Not provided",
      })
      await sendEmail({
        to: adminEmail,
        subject: `🚨 New Student Registration: ${full_name} (${courseTitle})`,
        html: adminEmailHTML,
      })
    }

    return Response.json(
      {
        success: true,
        message: "Confirmation emails sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Send confirmation email API error:", error)
    return Response.json({ error: "Failed to send email" }, { status: 500 })
  }
}
