import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { checkRateLimit, getClientKey } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const key = `login:${getClientKey(request)}`
    const rl = checkRateLimit(key, 5, 5 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }

    // Simple authentication - in production, use proper authentication
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim()
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()
    const GMAIL_USER = process.env.GMAIL_USER
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
    const MFA_SECRET = (process.env.ADMIN_MFA_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "mfa_secret").toString()

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("[v0] CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env")
      return Response.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Clean wrapping quotes from env if they persist
    const cleanEmail = ADMIN_EMAIL.replace(/^["']|["']$/g, "").toLowerCase()
    const cleanPassword = ADMIN_PASSWORD.replace(/^["']|["']$/g, "")
    const inputEmail = username?.trim().toLowerCase()

    if (inputEmail === cleanEmail && password === cleanPassword) {
      const cookieStore = await cookies()

      // Generate MFA code (6-digit)
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const hash = crypto.createHmac("sha256", MFA_SECRET).update(code).digest("hex")

      // Store MFA state in secure, httpOnly cookies (5 min)
      const commonCookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
      }
      cookieStore.set("mfa_pending", "true", { ...commonCookieOpts, maxAge: 60 * 5 })
      cookieStore.set("mfa_code_hash", hash, { ...commonCookieOpts, maxAge: 60 * 5 })

      // Send MFA code via email if SMTP configured
      if (GMAIL_USER && GMAIL_APP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: GMAIL_USER,
              pass: GMAIL_APP_PASSWORD,
            },
          })

          await transporter.sendMail({
            from: `"Gh0sT Tech" <${GMAIL_USER}>`,
            to: cleanEmail,
            subject: "Your Admin MFA Code",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Admin Two-Factor Verification</h2>
                <p>Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</div>
                <p>This code will expire in 5 minutes.</p>
              </div>
            `,
          })
        } catch (emailErr) {
          console.error("Failed to send MFA email:", emailErr)
          // Proceed; user can request another code if needed
        }
      }

      // Require MFA verification before granting admin access
      return Response.json({ mfa_required: true }, { status: 200 })
    } else {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
