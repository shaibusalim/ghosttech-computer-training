import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"

export async function GET() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

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
