import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear the admin auth cookie
    cookieStore.set('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return Response.json({ success: true }, { status: 200 })
  } catch {
    return Response.json({ error: "Logout failed" }, { status: 500 })
  }
}
