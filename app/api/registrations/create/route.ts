import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/server"
import { checkRateLimit, getClientKey, sanitizeText, digitsOnly } from "@/lib/utils"
import { getCourseById } from "@/lib/courses-data"

const schema = z.object({
  full_name: z.string().min(2).max(255),
  phone_number: z.string().min(8).max(20),
  whatsapp_number: z.string().min(8).max(20),
  email: z.string().email().max(255),
  location: z.string().min(2).max(255),
  course_selection: z.string().min(2).max(100),
  course_id: z.string().optional(),
  backend_preference: z.string().optional(),
  total_fee: z.number().optional(),
  required_deposit: z.number().optional(),
  previous_knowledge: z.boolean(),
  education_level: z.string().optional(),
  experience_level: z.string().optional(),
  motivation: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const key = `register:${getClientKey(request)}`
    const rl = checkRateLimit(key, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 })
    }
    const v = parsed.data

    const courseObj = getCourseById(v.course_id || "hardware-engineering")
    const totalFee = v.total_fee || courseObj.totalFee
    const requiredDeposit = v.required_deposit || courseObj.requiredDeposit

    const payload = {
      full_name: sanitizeText(v.full_name),
      phone_number: digitsOnly(v.phone_number),
      whatsapp_number: digitsOnly(v.whatsapp_number),
      email: sanitizeText(v.email).toLowerCase(),
      location: sanitizeText(v.location),
      course_selection: sanitizeText(v.course_selection || courseObj.title),
      course_id: sanitizeText(v.course_id || courseObj.id),
      backend_preference: sanitizeText(v.backend_preference ?? ""),
      total_fee: totalFee,
      required_deposit: requiredDeposit,
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
      console.error("Supabase insert error:", error)
      return Response.json({ error: "Failed to create registration" }, { status: 500 })
    }
    const id = data[0]?.id
    return Response.json({ id, required_deposit: requiredDeposit, total_fee: totalFee }, { status: 201 })
  } catch (e) {
    console.error("Registrations create error:", e)
    return Response.json({ error: "Unexpected error" }, { status: 500 })
  }
}
