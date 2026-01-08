export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = "registration" } = body

    if (type === "approval") {
      // Handle approval notification
      const { full_name, email, course_selection } = body

      const adminEmail = process.env.ADMIN_EMAIL
      if (!adminEmail) {
        console.error("ADMIN_EMAIL not configured")
        return Response.json({ error: "Admin email not configured" }, { status: 500 })
      }

      // Create approval confirmation email HTML template
      const emailHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #fff; padding: 30px; border-radius: 8px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; }
              .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
              .success-box { background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .success-box h3 { color: #166534; margin-top: 0; }
              .info-box { background: #fff; padding: 20px; margin: 15px 0; border-left: 4px solid #16a34a; border-radius: 4px; }
              .info-box h3 { color: #16a34a; margin-top: 0; }
              .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Registration Approved!</h1>
                <p>Welcome to Gh0sT Tech Training Program</p>
              </div>

              <div class="content">
                <div class="success-box">
                  <h3>Congratulations!</h3>
                  <p>Your registration has been approved and you're now enrolled in our comprehensive computer training program.</p>
                </div>

                <div class="info-box">
                  <h3>Student Information</h3>
                  <p><strong>Name:</strong> ${full_name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Courses:</strong> ${course_selection}</p>
                  <p><strong>Approval Date:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <div class="info-box">
                  <h3>Next Steps</h3>
                  <p>Our team will contact you shortly to:</p>
                  <ul>
                    <li>Arrange payment (GHS 700)</li>
                    <li>Schedule your classes</li>
                    <li>Provide course materials</li>
                  </ul>
                </div>

                <div class="info-box">
                  <h3>Course Details</h3>
                  <p><strong>Duration:</strong> 3 months</p>
                  <p><strong>Location:</strong> Tamale - Gurugu, Ghana</p>
                  <p><strong>Includes:</strong> Computer Hardware, Software & System Management, Networking Basics</p>
                </div>

                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>Welcome to the Gh0sT Tech family!</p>
                <p>Best regards,<br><strong>Gh0sT Tech Team</strong></p>
              </div>

              <div class="footer">
                <p>&copy; 2026 Gh0sT Tech. Automated Approval Notification.</p>
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
          subject: `🎉 Welcome to Gh0sT Tech - Registration Approved!`,
          html: emailHTML,
        }),
      })

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text()
        console.error("Resend API error:", errorData)
        return Response.json({ error: "Failed to send approval notification" }, { status: 500 })
      }

      const resendData = await resendResponse.json()
      console.log("Approval notification sent successfully:", resendData)

      return Response.json(
        {
          success: true,
          message: "Approval notification sent successfully",
          email_id: resendData.id,
        },
        { status: 200 },
      )
    }

    // Handle new registration notification (existing logic)
    const {
      full_name,
      phone_number,
      whatsapp_number,
      email,
      location,
      previous_knowledge,
      registration_id
    } = body

    // Validate input
    if (!full_name || !email || !registration_id) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      console.error("ADMIN_EMAIL not configured")
      return Response.json({ error: "Admin email not configured" }, { status: 500 })
    }

    // Create admin notification email HTML template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #fff; padding: 30px; border-radius: 8px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
            .info-box { background: #fff; padding: 20px; margin: 15px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
            .info-box h3 { color: #dc2626; margin-top: 0; }
            .registration-id { background: #fef3c7; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
            .contact-info { background: #fff; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .contact-info a { color: #dc2626; text-decoration: none; }
            .urgent { background: #fee2e2; border: 1px solid #fecaca; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .urgent h3 { color: #dc2626; margin-top: 0; }
            .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Registration Alert</h1>
              <p>A student has registered for your course!</p>
            </div>

            <div class="content">
              <div class="urgent">
                <h3>Action Required</h3>
                <p>Please contact the student to arrange payment (GHS 700) and class scheduling.</p>
              </div>

              <div class="info-box">
                <h3>Student Registration Details</h3>
                <p><strong>Full Name:</strong> ${full_name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone Number:</strong> <a href="tel:${phone_number}">${phone_number}</a></p>
                <p><strong>WhatsApp Number:</strong> <a href="https://wa.me/${whatsapp_number.replace('+', '')}">${whatsapp_number}</a></p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Previous Computer Knowledge:</strong> ${previous_knowledge ? "Yes" : "No"}</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
                <div class="registration-id">
                  <strong>Registration ID:</strong> ${registration_id}
                </div>
              </div>

              <div class="info-box">
                <h3>Course Information</h3>
                <p><strong>Enrolled Courses:</strong> Computer Hardware, Software & System Management, Networking Basics</p>
                <p><strong>Course Fee:</strong> GHS 700</p>
                <p><strong>Duration:</strong> 3 months (all courses included)</p>
                <p><strong>Location:</strong> Tamale - Gurugu, Ghana</p>
              </div>

              <div class="contact-info">
                <h3>Quick Actions</h3>
                <p><strong>📧 Send Email:</strong> <a href="mailto:${email}?subject=Gh0sT Tech Course Registration">${email}</a></p>
                <p><strong>📞 Call:</strong> <a href="tel:${phone_number}">${phone_number}</a></p>
                <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/${whatsapp_number.replace('+', '')}?text=Hello ${full_name}, thank you for registering with Gh0sT Tech!">Send WhatsApp Message</a></p>
              </div>

              <p>Please reach out to the student as soon as possible to confirm their registration and arrange payment details.</p>
              <p>Best regards,<br><strong>Gh0sT Tech Registration System</strong></p>
            </div>

            <div class="footer">
              <p>&copy; 2026 Gh0sT Tech. Admin Notification System.</p>
              <p>This is an automated notification for new student registrations.</p>
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
        to: [adminEmail],
        subject: `🚨 New Student Registration: ${full_name}`,
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error("Resend API error:", errorData)
      return Response.json({ error: "Failed to send admin notification" }, { status: 500 })
    }

    const resendData = await resendResponse.json()
    console.log("Admin notification sent successfully:", resendData)

    return Response.json(
      {
        success: true,
        message: "Admin notification sent successfully",
        email_id: resendData.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Admin notification API error:", error)
    return Response.json({ error: "Failed to send admin notification" }, { status: 500 })
  }
}
