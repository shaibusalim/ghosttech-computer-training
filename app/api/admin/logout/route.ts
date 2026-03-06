import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear the admin auth cookie
    const commonCookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    }
    cookieStore.set('admin_auth', '', { ...commonCookieOpts, maxAge: 0 })
    cookieStore.set('mfa_pending', '', { ...commonCookieOpts, maxAge: 0 })
    cookieStore.set('mfa_code_hash', '', { ...commonCookieOpts, maxAge: 0 })

    return Response.json({ success: true }, { status: 200 })
  } catch {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
