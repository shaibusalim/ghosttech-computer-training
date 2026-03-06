import { cookies } from "next/headers"
import crypto from "crypto"
import { checkRateLimit, getClientKey } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const key = `mfa:${getClientKey(request)}`
    const rl = checkRateLimit(key, 10, 10 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }
    const { code } = await request.json()
    if (!code || typeof code !== "string") {
      return Response.json({ error: "Missing code" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const mfaPending = cookieStore.get("mfa_pending")
    const storedHash = cookieStore.get("mfa_code_hash")
    const MFA_SECRET = (process.env.ADMIN_MFA_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "mfa_secret").toString()

    if (!mfaPending || mfaPending.value !== "true" || !storedHash) {
      return Response.json({ error: "No MFA pending" }, { status: 400 })
    }

    const computed = crypto.createHmac("sha256", MFA_SECRET).update(code).digest("hex")
    if (computed !== storedHash.value) {
      return Response.json({ error: "Invalid code" }, { status: 401 })
    }

    const commonCookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    }

    // Clear MFA cookies
    cookieStore.set("mfa_pending", "", { ...commonCookieOpts, maxAge: 0 })
    cookieStore.set("mfa_code_hash", "", { ...commonCookieOpts, maxAge: 0 })

    // Grant admin access cookie (24h)
    cookieStore.set("admin_auth", "true", { ...commonCookieOpts, maxAge: 60 * 60 * 24 })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("MFA verify error:", error)
    return Response.json({ error: "Verification failed" }, { status: 500 })
  }
}
