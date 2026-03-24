import { sendEmail, emailTemplates } from "@/lib/email-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, full_name, course_selection, phone_number, whatsapp_number, location } = body

    // Validate input
    if (!email || !full_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get course details for the email
    const courseDetails: Record<string, { name: string; description: string }> = {
      hardware: {
        name: "Computer Hardware",
        description: "Master the fundamentals of computer components and hardware maintenance",
      },
      software: {
        name: "Software & System Management",
        description: "Learn essential software skills for daily computing",
      },
      networking: {
        name: "Networking Basics",
        description: "Understand network fundamentals and connectivity",
      },
    }

    const course = courseDetails[course_selection] || { 
      name: course_selection || "All Courses", 
      description: "Practical Computer Training Program" 
    }

    // 1. Send confirmation to student
    const studentEmailHTML = emailTemplates.registration(full_name, course.name, course.description)
    await sendEmail({
      to: email,
      subject: "Welcome to Gh0sT Tech! - Registration Confirmed",
      html: studentEmailHTML,
    })

    // 2. Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const adminEmailHTML = emailTemplates.adminAlert({
        full_name,
        email,
        phone_number: phone_number || "Not provided",
        whatsapp_number: whatsapp_number || "Not provided",
        location: location || "Not provided",
      })
      await sendEmail({
        to: adminEmail,
        subject: `🚨 New Student Registration: ${full_name}`,
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
    console.error("[v0] Email API error:", error)
    return Response.json({ error: "Failed to send email" }, { status: 500 })
  }
}
