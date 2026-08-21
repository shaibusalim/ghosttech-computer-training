import nodemailer from "nodemailer"

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const mailOptions = {
      from: `"Gh0sT Tech" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export const emailTemplates = {
  registration: (fullName: string, courseName: string, requiredDeposit?: number, backendPref?: string) => `
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
          .info-box { background: #fff; padding: 20px; margin: 15px 0; border-left: 4px solid #10b981; border-radius: 4px; }
          .info-box h3 { color: #10b981; margin-top: 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Gh0sT Tech!</h1>
            <p>Your Registration is Received</p>
          </div>
          <div class="content">
            <p>Hi <strong>${fullName}</strong>,</p>
            <p>Thank you for registering with Gh0sT Tech! We are excited to have you join our practical training program.</p>
            <div class="info-box">
              <h3>Your Registration Summary</h3>
              <p><strong>Student Name:</strong> ${fullName}</p>
              <p><strong>Selected Course:</strong> ${courseName}</p>
              ${backendPref ? `<p><strong>Backend Track:</strong> ${backendPref}</p>` : ""}
              <p><strong>Seat Deposit Required:</strong> GHS ${requiredDeposit || 300}</p>
              <p><strong>Training Venue:</strong> Tamale - Gurugu, Ghana</p>
            </div>
            <div class="info-box">
              <h3>Next Steps</h3>
              <p>1. Complete your deposit payment via Paystack Mobile Money</p>
              <p>2. Our team will contact you with batch schedules and onboarding instructions</p>
              <p>3. Training starts upon seat confirmation</p>
            </div>
            <p>Best regards,<br><strong>Gh0sT Tech Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Gh0sT Tech. Practical IT & Software Training in Tamale.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  payment: (fullName: string, paymentStatus: string, amountText: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: #fff; padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 30px; margin: 20px 0; border-radius: 8px; }
          .info-box { background: #fff; padding: 20px; margin: 15px 0; border-left: 4px solid #0ea5e9; border-radius: 4px; }
          .info-box h3 { color: #0ea5e9; margin-top: 0; }
          .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Receipt & Confirmation</h1>
            <p>Gh0sT Tech Training Program</p>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>Hello ${fullName},</h3>
              <p>We have updated your payment status for the course.</p>
              <p><strong>Payment Status:</strong> ${paymentStatus.toUpperCase()}</p>
              <p><strong>Details:</strong> ${amountText}</p>
            </div>
            <p>Best regards,<br><strong>Gh0sT Tech Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Gh0sT Tech. Automated Payment Confirmation.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  approval: (fullName: string) => `
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
              <h3>Hello ${fullName},</h3>
              <p>Congratulations 🎉 and welcome to Gh0sT Tech Computer Training Program.</p>
              <p>Your seat has been approved and confirmed. We look forward to helping you build real, practical computer skills.</p>
            </div>
            <p>Best regards,<br><strong>Gh0sT Tech Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Gh0sT Tech. Automated Approval Notification.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  adminAlert: (details: any) => `
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
          .footer { text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Student Registration Alert</h1>
            <p>A student has registered for a course!</p>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>Registration Details</h3>
              <p><strong>Full Name:</strong> ${details.full_name}</p>
              <p><strong>Selected Course:</strong> ${details.course_selection}</p>
              ${details.backend_preference ? `<p><strong>Backend Preference:</strong> ${details.backend_preference}</p>` : ""}
              <p><strong>Email:</strong> ${details.email}</p>
              <p><strong>Phone:</strong> ${details.phone_number}</p>
              <p><strong>WhatsApp:</strong> ${details.whatsapp_number}</p>
              <p><strong>Location:</strong> ${details.location}</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 Gh0sT Tech. Admin Notification System.</p>
          </div>
        </div>
      </body>
    </html>
  `,
}
