export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const ok = password && process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD
    if (!ok) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const cookie = [
      "admin_auth=true",
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=86400",
    ].join("; ")
    return Response.json({ success: true }, { status: 200, headers: { "Set-Cookie": cookie } })
  } catch {
    return Response.json({ error: "Bad Request" }, { status: 400 })
  }
}
