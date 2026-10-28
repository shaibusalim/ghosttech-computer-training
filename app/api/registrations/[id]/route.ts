import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { checkRateLimit, getClientKey } from "@/lib/utils"
import { isUuid } from "@/lib/payments"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rl = checkRateLimit(`reg-get:${getClientKey(request)}`, 60, 10 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many requests" }, { status: 429 })
    }

    const { id } = await params
    if (!isUuid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Public endpoint (used by the payment page): expose only what that page needs, never contact details.
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("id, full_name, course_selection, course_id, backend_preference, total_fee, required_deposit, payment_status, status")
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
