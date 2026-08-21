import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { MAX_SEATS_PER_COHORT } from "@/lib/utils"

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    if (error) {
      console.error("Error fetching seat count from Supabase:", error)
      throw error
    }

    const confirmedCount = count ?? 0
    const remaining = Math.max(0, MAX_SEATS_PER_COHORT - confirmedCount)

    return NextResponse.json({ remaining, confirmedCount })
  } catch (err: any) {
    console.error("Failed to fetch seat count API:", err?.message || err)
    return NextResponse.json(
      { error: "Failed to fetch seat count", remaining: MAX_SEATS_PER_COHORT },
      { status: 500 }
    )
  }
}
