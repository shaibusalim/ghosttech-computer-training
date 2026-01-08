import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Simple authentication - in production, use proper authentication
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL 
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD 

    if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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