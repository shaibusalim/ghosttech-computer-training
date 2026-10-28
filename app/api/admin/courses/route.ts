import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin-auth"
import { ALL_COURSES, Course, mapDbCourseToCourse } from "@/lib/courses-data"
import { sanitizeText } from "@/lib/utils"

export async function GET() {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("order_index", { ascending: true })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ courses: ALL_COURSES, source: "catalog" })
    }

    const mapped = data.map(mapDbCourseToCourse)
    return NextResponse.json({ courses: mapped, source: "database" })
  } catch (err) {
    console.error("Admin courses GET error:", err)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    const body = (await request.json().catch(() => null)) as Partial<Course> | null
    if (!body || !body.id || !body.title) {
      return NextResponse.json({ error: "Missing course id or title" }, { status: 400 })
    }

    const id = sanitizeText(body.id).toLowerCase().replace(/[^a-z0-9_-]/g, "-")
    const anyBody = body as any
    const totalFee = Number(body.totalFee ?? anyBody.total_fee)
    const requiredDeposit = Number(body.requiredDeposit ?? anyBody.required_deposit)

    if (!Number.isFinite(totalFee) || totalFee < 0) {
      return NextResponse.json({ error: "Total fee must be a valid positive number" }, { status: 400 })
    }
    if (!Number.isFinite(requiredDeposit) || requiredDeposit < 0) {
      return NextResponse.json({ error: "Required deposit must be a valid positive number" }, { status: 400 })
    }
    if (requiredDeposit > totalFee) {
      return NextResponse.json({ error: "Required deposit cannot exceed total tuition fee" }, { status: 400 })
    }

    const hasAiIncluded = Boolean(body.hasAiIncluded ?? anyBody.has_ai_included)
    const hasBackendOption = Boolean(body.hasBackendOption ?? anyBody.has_backend_option)
    const isActive = (body.isActive !== undefined ? body.isActive : anyBody.is_active) !== false
    const subCategory = body.subCategory ?? anyBody.sub_category

    const payload = {
      id,
      slug: id,
      title: sanitizeText(body.title),
      subtitle: sanitizeText(body.subtitle ?? ""),
      category: body.category || "Software",
      sub_category: subCategory ? sanitizeText(subCategory) : null,
      duration: sanitizeText(body.duration || "4 Weeks"),
      total_fee: totalFee,
      required_deposit: requiredDeposit,
      badge: body.badge ? sanitizeText(body.badge) : null,
      accent_color: body.accentColor || null,
      has_ai_included: hasAiIncluded,
      has_backend_option: hasBackendOption,
      highlights: Array.isArray(body.highlights) ? body.highlights.map(sanitizeText).filter(Boolean) : [],
      syllabus: Array.isArray(body.syllabus) ? body.syllabus : [],
      is_active: isActive,
      order_index: Number(body.orderIndex ?? anyBody.order_index) || 0,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from("courses")
      .upsert([payload], { onConflict: "id" })
      .select()

    if (error) {
      console.error("Error upserting course in Supabase:", error)
      if (error.code === "PGRST205") {
        return NextResponse.json(
          {
            error: "Courses table not found in Supabase. Please run scripts/04-create-courses-table.sql in your Supabase SQL Editor.",
          },
          { status: 400 },
        )
      }
      return NextResponse.json({ error: error.message || "Failed to save course" }, { status: 500 })
    }

    return NextResponse.json({ success: true, course: mapDbCourseToCourse(data[0]) }, { status: 200 })
  } catch (err) {
    console.error("Admin courses POST error:", err)
    return NextResponse.json({ error: "Failed to save course" }, { status: 500 })
  }
}
