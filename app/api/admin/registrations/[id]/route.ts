import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"
import { isUuid } from "@/lib/payments"

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    if (!isUuid(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('registrations')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Supabase delete failed:", deleteError)
      return Response.json({ error: "Failed to delete registration" }, { status: 500 })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting registration:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Failed to delete registration" }, { status: 500 })
  }
}
