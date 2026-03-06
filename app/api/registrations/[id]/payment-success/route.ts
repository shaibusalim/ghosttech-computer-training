import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: "full",
        status: "awaiting_admin_approval",
      })
      .eq('id', id)

    if (updateError) throw updateError

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating registration payment status:", error)
    return Response.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}

