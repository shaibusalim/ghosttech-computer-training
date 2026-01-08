
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type = "registration" } = body

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    if (type === "approval") {
      // Handle approval notification
      const { full_name, email, course_selection } = body

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
              .program-overview { background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .program-overview h3 { color: #0369a1; margin-top: 0; }
              .payment-info { background: #fef3c7; border: 1px solid #fde68a; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .payment-info h3 { color: #92400e; margin-top: 0; }
              .telegram-group { background: #e0f2fe; border: 1px solid #bae6fd; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .telegram-group h3 { color: #0369a1; margin-top: 0; }
              .contact-info { background: #f3e8ff; border: 1px solid #d8b4fe; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .contact-info h3 { color: #7c3aed; margin-top: 0; }
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
                  <h3>Hello ${full_name},</h3>
                  <p>Congratulations 🎉 and welcome to Gh0sT Tech Computer Training Program.</p>
                  <p>We are pleased to confirm your registration for our Computer Hardware, Software & Basic Networking course.</p>
                </div>

                <div class="program-overview">
                  <h3>📚 Program Overview</h3>
                  <p>During this training, you will learn:</p>
                  <ul>
                    <li>• Computer hardware components, assembling & troubleshooting</li>
                    <li>• Windows and Microsoft Office installation</li>
                    <li>• Software troubleshooting and virus removal</li>
                    <li>• Basic networking concepts and LAN setup</li>
                  </ul>
                </div>

                <div class="info-box">
                  <h3>🗓️ Training Start Date</h3>
                  <p><strong>Start Date:</strong> First Week of February</p>
                  <p><strong>Location:</strong> Tamale – Gurugu</p>
                </div>

                <div class="payment-info">
                  <h3>💰 Payment Information</h3>
                  <p><strong>Total course fee is GHS 700.</strong></p>
                  <p>Payment can be made using any of the following options:</p>
                  <ul>
                    <li>✅ Full payment before training begins</li>
                    <li>✅ Part payment before start + balance midway through the program</li>
                  </ul>
                  <p><em>Payment is done physically. Our team will guide you on payment arrangements.</em></p>
                </div>

                <div class="telegram-group">
                  <h3>📲 Telegram Group</h3>
                  <p>Please join our official Telegram group for announcements, class updates, and learning materials:</p>
                  <p>👉 <a href="https://t.me/+I7G7vwNqWko2NGFk" style="color: #0369a1; text-decoration: none; font-weight: bold;">https://t.me/+I7G7vwNqWko2NGFk</a></p>
                </div>

                <div class="contact-info">
                  <h3>Contact Information</h3>
                  <p>If you have any questions, feel free to contact us:</p>
                  <p><strong>📞 Phone:</strong> 0541120274</p>
                  <p><strong>💬 WhatsApp:</strong> 0209832978</p>
                </div>

                <div class="success-box">
                  <p>We look forward to training you and helping you build real, practical computer skills.</p>
                  <p><strong>Welcome once again!</strong></p>
                </div>

                <p>Best regards,<br><strong>Gh0sT Tech Team</strong><br>Practical Computer Training in Tamale</p>
              </div>

              <div class="footer">
                <p>&copy; 2026 Gh0sT Tech. Automated Approval Notification.</p>
                <p>This email was sent automatically upon registration approval.</p>
              </div>
            </div>
          </body>
        </html>
      `

      // Send email using Gmail SMTP
      try {
        const mailOptions = {
          from: `"Gh0sT Tech" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "🎉 Welcome to Gh0sT Tech - Registration Approved!",
          html: emailHTML,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log("Approval notification sent successfully:", info.messageId)

        return Response.json(
          {
            success: true,
            message: "Approval notification sent successfully",
            email_id: info.messageId,
          },
          { status: 200 },
        )
      } catch (emailError) {
        console.error("Gmail SMTP error:", emailError)
        return Response.json({ error: "Failed to send approval notification" }, { status: 500 })
      }
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

    // Send email using Gmail SMTP
    try {
      const mailOptions = {
        from: `"Gh0sT Tech" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `🚨 New Student Registration: ${full_name}`,
        html: emailHTML,
      }

      const info = await transporter.sendMail(mailOptions)
      console.log("Admin notification sent successfully:", info.messageId)

      return Response.json(
        {
          success: true,
          message: "Admin notification sent successfully",
          email_id: info.messageId,
        },
        { status: 200 },
      )
    } catch (emailError) {
      console.error("Gmail SMTP error:", emailError)
      return Response.json({ error: "Failed to send admin notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Admin notification API error:", error)
    return Response.json({ error: "Failed to send admin notification" }, { status: 500 })
  }
}
