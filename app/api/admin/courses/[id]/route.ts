import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"
import { mapDbCourseToCourse } from "@/lib/courses-data"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    const body = await request.json().catch(() => null)

    if (!id || !body) {
      return NextResponse.json({ error: "Missing ID or payload" }, { status: 400 })
    }

    const update: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (typeof body.isActive === "boolean") update.is_active = body.isActive
    if (typeof body.is_active === "boolean") update.is_active = body.is_active

    const totalFee = typeof body.totalFee === "number" ? body.totalFee : typeof body.total_fee === "number" ? body.total_fee : undefined
    if (typeof totalFee === "number" && totalFee >= 0) update.total_fee = totalFee

    const requiredDeposit = typeof body.requiredDeposit === "number" ? body.requiredDeposit : typeof body.required_deposit === "number" ? body.required_deposit : undefined
    if (typeof requiredDeposit === "number" && requiredDeposit >= 0) update.required_deposit = requiredDeposit

    if (typeof body.title === "string") update.title = body.title.trim()
    if (typeof body.badge === "string") update.badge = body.badge.trim()

    const { data, error } = await supabaseAdmin
      .from("courses")
      .update(update)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Course PATCH error:", error)
      return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Course not found in database" }, { status: 404 })
    }

    return NextResponse.json({ success: true, course: mapDbCourseToCourse(data[0]) }, { status: 200 })
  } catch (err) {
    console.error("Course PATCH error:", err)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 })
    }

    // Rather than hard-deleting which breaks registrations foreign keys, set is_active = false
    const { error } = await supabaseAdmin
      .from("courses")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Course deactivate error:", error)
      return NextResponse.json({ error: "Failed to deactivate course" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Course deactivated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Course DELETE error:", err)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
