import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { ALL_COURSES, mapDbCourseToCourse } from "@/lib/courses-data"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("order_index", { ascending: true })

    if (error || !data || data.length === 0) {
      // Clean fallback if table is not yet migrated in Supabase
      return NextResponse.json({ courses: ALL_COURSES, source: "catalog" }, { headers })
    }

    const mapped = data.map(mapDbCourseToCourse)
    return NextResponse.json({ courses: mapped, source: "database" }, { headers })
  } catch (err) {
    console.error("Failed to load courses from DB:", err)
    return NextResponse.json({ courses: ALL_COURSES, source: "catalog" }, { headers })
  }
}
