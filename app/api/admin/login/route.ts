import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Simple authentication - in production, use proper authentication
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim()
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim()

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

      // Set admin auth cookie
      cookieStore.set('admin_auth', 'true', {
        httpOnly: false, // Allow client-side access for debugging
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })

      return Response.json({ success: true }, { status: 200 })
    } else {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
