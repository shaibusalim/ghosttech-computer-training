import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get("admin_auth")

    if (!adminAuth || adminAuth.value !== "true") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

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

