import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/server"
import { checkRateLimit, getClientKey, sanitizeText, digitsOnly } from "@/lib/utils"

const schema = z.object({
  full_name: z.string().min(2).max(255),
  phone_number: z.string().min(8).max(20),
  whatsapp_number: z.string().min(8).max(20),
  email: z.string().email().max(255),
  location: z.string().min(2).max(255),
  course_selection: z.string().min(2).max(100),
  previous_knowledge: z.boolean(),
  education_level: z.string().optional(),
  experience_level: z.string().optional(),
  motivation: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const key = `register:${getClientKey(request)}`
    const rl = checkRateLimit(key, 5, 60 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid data" }, { status: 400 })
    }
    const v = parsed.data

    const payload = {
      full_name: sanitizeText(v.full_name),
      phone_number: digitsOnly(v.phone_number),
      whatsapp_number: digitsOnly(v.whatsapp_number),
      email: sanitizeText(v.email).toLowerCase(),
      location: sanitizeText(v.location),
      course_selection: sanitizeText(v.course_selection),
      previous_knowledge: v.previous_knowledge,
      education_level: sanitizeText(v.education_level ?? ""),
      experience_level: sanitizeText(v.experience_level ?? ""),
      motivation: sanitizeText(v.motivation ?? ""),
      status: "pending_payment",
      payment_status: "none",
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("registrations").insert([payload]).select()
    if (error) {
      return Response.json({ error: "Failed to create registration" }, { status: 500 })
    }
    const id = data[0]?.id
    return Response.json({ id }, { status: 201 })
  } catch (e) {
    return Response.json({ error: "Unexpected error" }, { status: 500 })
  }
}
