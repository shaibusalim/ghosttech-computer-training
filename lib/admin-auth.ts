import crypto from "crypto"
import { cookies } from "next/headers"

/**
 * Admin session + MFA helpers.
 *
 * Sessions and MFA challenges are stateless, HMAC-signed tokens that carry their
 * own expiry. They cannot be forged without the server-side secret, unlike the
 * old `admin_auth=true` cookie which anyone could set by hand.
 */

export const ADMIN_COOKIE = "admin_auth"
export const MFA_COOKIE = "mfa_challenge"

export const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 hours
export const MFA_TTL_SECONDS = 60 * 5 // 5 minutes

export const baseCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
}

/** Derives a purpose-specific key so a token for one use can't be replayed for another. */
function deriveKey(purpose: string): Buffer {
  const base =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_MFA_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || base.length < 16) {
    throw new Error(
      "No admin signing secret configured. Set ADMIN_SESSION_SECRET (>= 32 random chars) in your environment.",
    )
  }
  return crypto.createHmac("sha256", base).update(`gh0st-tech:${purpose}`).digest()
}

function sign(purpose: string, data: string): string {
  return crypto.createHmac("sha256", deriveKey(purpose)).update(data).digest("base64url")
}

/** Constant-time string comparison (safe for differing lengths). */
export function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest()
  const hb = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

// ---------- Admin session ----------

export function createAdminSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const nonce = crypto.randomBytes(16).toString("base64url")
  const payload = `${exp}.${nonce}`
  return `${payload}.${sign("session", payload)}`
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [expStr, nonce, sig] = parts
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false
  try {
    return safeEqual(sig, sign("session", `${expStr}.${nonce}`))
  } catch {
    return false
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value)
}

/** Returns a 401 Response when the caller isn't an authenticated admin, otherwise null. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdminAuthenticated()) return null
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}

// ---------- MFA challenge ----------

export function generateMfaCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0")
}

/** Signed challenge bound to the code. The code itself is never stored; the key is server-side only. */
export function createMfaChallenge(code: string): string {
  const exp = Math.floor(Date.now() / 1000) + MFA_TTL_SECONDS
  const nonce = crypto.randomBytes(16).toString("base64url")
  const payload = `${exp}.${nonce}`
  return `${payload}.${sign("mfa", `${payload}.${code}`)}`
}

export function verifyMfaChallenge(token: string | undefined | null, code: string): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [expStr, nonce, sig] = parts
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false
  try {
    return safeEqual(sig, sign("mfa", `${expStr}.${nonce}.${code}`))
  } catch {
    return false
  }
}
