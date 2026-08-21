import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("id, full_name, email, course_selection, course_id, backend_preference, total_fee, required_deposit, payment_status, status")
      .eq("id", id)
      .single()

    if (error || !data) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    return Response.json({ registration: data }, { status: 200 })
  } catch (error) {
    console.error("Fetch registration error:", error)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}
