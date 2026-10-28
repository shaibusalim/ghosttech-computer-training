import { cookies } from "next/headers"
import nodemailer from "nodemailer"
import { checkRateLimit, getClientKey } from "@/lib/utils"
import {
  MFA_COOKIE,
  MFA_TTL_SECONDS,
  baseCookieOpts,
  createMfaChallenge,
  generateMfaCode,
  safeEqual,
} from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const key = `login:${getClientKey(request)}`
    const rl = checkRateLimit(key, 5, 5 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }
    // Global ceiling so credential stuffing spread across many IPs is still throttled.
    const globalRl = checkRateLimit("login:global", 30, 15 * 60 * 1000)
    if (!globalRl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const username = typeof body?.username === "string" ? body.username : ""
    const password = typeof body?.password === "string" ? body.password : ""

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim()
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()
    const GMAIL_USER = process.env.GMAIL_USER
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("CRITICAL: ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment")
      return Response.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Clean wrapping quotes from env if they persist
    const cleanEmail = ADMIN_EMAIL.replace(/^["']|["']$/g, "").toLowerCase()
    const cleanPassword = ADMIN_PASSWORD.replace(/^["']|["']$/g, "")
    const inputEmail = username.trim().toLowerCase()

    // Evaluate both comparisons (constant-time) so timing doesn't reveal which field was wrong.
    const emailOk = safeEqual(inputEmail, cleanEmail)
    const passwordOk = safeEqual(password, cleanPassword)

    if (!(emailOk && passwordOk)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const cookieStore = await cookies()

    // Cryptographically secure 6-digit code. Only a keyed, expiring signature of it is stored client-side.
    const code = generateMfaCode()
    cookieStore.set(MFA_COOKIE, createMfaChallenge(code), { ...baseCookieOpts, maxAge: MFA_TTL_SECONDS })

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
        // Proceed; user can log in again to request another code
      }
    }

    // Require MFA verification before granting admin access
    return Response.json({ mfa_required: true }, { status: 200 })
  } catch (error) {
    console.error("Admin login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
