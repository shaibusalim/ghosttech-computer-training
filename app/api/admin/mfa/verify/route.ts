import { cookies } from "next/headers"
import { checkRateLimit, getClientKey } from "@/lib/utils"
import {
  ADMIN_COOKIE,
  MFA_COOKIE,
  SESSION_TTL_SECONDS,
  baseCookieOpts,
  createAdminSessionToken,
  verifyMfaChallenge,
} from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const rl = checkRateLimit(`mfa:${getClientKey(request)}`, 5, 10 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }
    // Global ceiling: a 6-digit code must not be brute-forceable from many IPs.
    const globalRl = checkRateLimit("mfa:global", 30, 15 * 60 * 1000)
    if (!globalRl.allowed) {
      return Response.json({ error: "Too many attempts" }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const code = body?.code
    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      return Response.json({ error: "Missing or malformed code" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const challenge = cookieStore.get(MFA_COOKIE)?.value
    if (!challenge) {
      return Response.json({ error: "No MFA pending" }, { status: 400 })
    }

    if (!verifyMfaChallenge(challenge, code.trim())) {
      return Response.json({ error: "Invalid or expired code" }, { status: 401 })
    }

    // Single use: clear the challenge and issue a signed, expiring admin session.
    cookieStore.set(MFA_COOKIE, "", { ...baseCookieOpts, maxAge: 0 })
    cookieStore.set(ADMIN_COOKIE, createAdminSessionToken(), { ...baseCookieOpts, maxAge: SESSION_TTL_SECONDS })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("MFA verify error:", error)
    return Response.json({ error: "Verification failed" }, { status: 500 })
  }
}
