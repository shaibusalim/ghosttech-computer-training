import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"
import { isUuid } from "@/lib/payments"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    if (!isUuid(id) && !/^\d+$/.test(id)) {
      return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    const { data: doc, error: fetchError } = await supabaseAdmin
      .from('gallery')
      .select('storagepath')
      .eq('id', id)
      .single()

    if (fetchError || !doc) {
      return Response.json({ error: "Gallery item not found" }, { status: 404 })
    }

    const storagePath = doc.storagepath

    if (storagePath) {
      try {
        await supabaseAdmin.storage.from('gallery').remove([storagePath])
      } catch (storageError) {
        // Log but do not block deletion of db row
        console.error("Failed to delete gallery image from storage:", storageError)
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from('gallery')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return Response.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}

