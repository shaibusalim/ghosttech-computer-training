import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')

    if (!adminAuth) {
      return Response.json({ error: "No auth cookie" }, { status: 401 })
    }

    if (adminAuth.value !== 'true') {
      return Response.json({ error: "Invalid auth cookie" }, { status: 401 })
    }

    // Fetch all registrations ordered by creation date (newest first)
    const { data: registrations, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError

    return Response.json({ registrations }, { status: 200 })
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return Response.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
