import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { MAX_SEATS_PER_COHORT, checkRateLimit, getClientKey } from "@/lib/utils"
import { COURSES_CATALOG } from "@/lib/courses-data"

export async function GET(request: NextRequest) {
  try {
    const rl = checkRateLimit(`seats:${getClientKey(request)}`, 60, 5 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("course_id")

    let query = supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    // Scope seat count to a specific course if provided and valid
    if (courseId && Object.prototype.hasOwnProperty.call(COURSES_CATALOG, courseId)) {
      query = query.eq("course_id", courseId)
    }

    const { count, error } = await query

    if (error) {
      console.error("Error fetching seat count from Supabase:", error)
      throw error
    }

    const confirmedCount = count ?? 0
    const remaining = Math.max(0, MAX_SEATS_PER_COHORT - confirmedCount)

    return NextResponse.json({
      remaining,
      confirmedCount,
      maxSeats: MAX_SEATS_PER_COHORT,
      courseId: courseId || "all",
    })
  } catch (err: any) {
    console.error("Failed to fetch seat count API:", err?.message || err)
    return NextResponse.json(
      { error: "Failed to fetch seat count", remaining: MAX_SEATS_PER_COHORT },
      { status: 500 },
    )
  }
}
