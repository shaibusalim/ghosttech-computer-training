import { cookies } from "next/headers"
import { ADMIN_COOKIE, MFA_COOKIE, baseCookieOpts } from "@/lib/admin-auth"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear the admin session and any pending MFA challenge
    cookieStore.set(ADMIN_COOKIE, "", { ...baseCookieOpts, maxAge: 0 })
    cookieStore.set(MFA_COOKIE, "", { ...baseCookieOpts, maxAge: 0 })

    return Response.json({ success: true }, { status: 200 })
  } catch {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
