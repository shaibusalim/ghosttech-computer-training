import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log("Delete request received for ID:", id)

    // Check admin authentication
    const cookieStore = await cookies()
    const adminAuth = cookieStore.get('admin_auth')

    console.log("Admin auth cookie:", adminAuth)

    if (!adminAuth) {
      console.log("No auth cookie found")
      return Response.json({ error: "No auth cookie" }, { status: 401 })
    }

    if (adminAuth.value !== 'true') {
      console.log("Invalid auth cookie value:", adminAuth.value)
      return Response.json({ error: "Invalid auth cookie" }, { status: 401 })
    }

    console.log("Authentication passed, proceeding with delete")

    console.log("Attempting to delete document with ID:", id)

    const { error: deleteError } = await supabaseAdmin
      .from('registrations')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Supabase delete failed:", deleteError)
      return Response.json({ error: "Failed to delete registration" }, { status: 500 })
    }

    console.log("Delete successful for ID:", id)

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting registration:", error)
    console.error("Error details:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Failed to delete registration" }, { status: 500 })
  }
}
