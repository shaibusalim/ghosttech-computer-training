export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, full_name, course_selection, courses } = body

    // Validate input
    if (!email || !full_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get course details
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

    const selectedCourses: string[] =
      Array.isArray(courses) && courses.length > 0
        ? courses
        : course_selection
          ? [course_selection]
          : ["hardware", "software", "networking"]

    const coursesHTML = selectedCourses
      .map((key) => {
        const c = courseDetails[key] || { name: key, description: "" }
        return `<p><strong>${c.name}:</strong> ${c.description}</p>`
      })
      .join("")

    // Create email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #fff; padding: 30px; border-radius: 8px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
            .info-box { background: #fff; padding: 20px; margin: 15px 0; border-left: 4px solid #52ba26; border-radius: 4px; }
            .info-box h3 { color: #52ba26; margin-top: 0; }
            .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
            .contact-info { background: #fff; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .contact-info a { color: #52ba26; text-decoration: none; }
            .btn { display: inline-block; background: #52ba26; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Gh0sT Tech!</h1>
              <p>Your Registration is Confirmed</p>
            </div>

            <div class="content">
              <p>Hi <strong>${full_name}</strong>,</p>
              <p>Thank you for registering with Gh0sT Tech! We're excited to have you join our practical computer training program.</p>

              <div class="info-box">
                <h3>Your Registration Details</h3>
                <p><strong>Student Name:</strong> ${full_name}</p>
                <p><strong>Selected Courses:</strong></p>
                ${coursesHTML}
                <p><strong>Course Fee:</strong> GHS 700</p>
                <p><strong>Location:</strong> Tamale - Gurugu, Ghana</p>
              </div>

              <div class="info-box">
                <h3>Next Steps</h3>
                <p>1. We will contact you shortly regarding payment and class schedule</p>
                <p>2. Payment (GHS 700) can be made in person at our location</p>
                <p>3. Classes will begin once payment is confirmed</p>
                <p>4. Come prepared with a computer for hands-on training</p>
              </div>

              <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> <a href="tel:0541120274">0541120274</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/233209832978">0209832978</a></p>
                <p><strong>Location:</strong> Tamale - Gurugu, Ghana</p>
              </div>

              <p>If you have any questions, please don't hesitate to reach out to us via phone or WhatsApp.</p>
              <p>Best regards,<br><strong>Gh0sT Tech Team</strong></p>
            </div>

            <div class="footer">
              <p>&copy; 2026 Gh0sT Tech. All rights reserved.</p>
              <p>Practical Computer Training in Tamale, Ghana</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gh0sT Tech <noreply@resend.dev>",
        to: [email],
        subject: "Welcome to Gh0sT Tech - Registration Confirmed!",
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error("Resend API error:", errorData)
      return Response.json({ error: "Failed to send confirmation email" }, { status: 500 })
    }

    const resendData = await resendResponse.json()
    console.log("Confirmation email sent successfully:", resendData)

    return Response.json(
      {
        success: true,
        message: "Confirmation email sent successfully",
        email: email,
        email_id: resendData.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return Response.json({ error: "Failed to send email" }, { status: 500 })
  }
}
