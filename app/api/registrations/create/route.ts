import { NextRequest } from "next/server"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/server"
import { checkRateLimit, getClientKey, sanitizeText, digitsOnly } from "@/lib/utils"
import { COURSES_CATALOG } from "@/lib/courses-data"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

// Fees, deposit and course title are NOT accepted from the client (unknown keys are stripped);
// they are always derived from the server-side course catalog.
const schema = z.object({
  full_name: z.string().min(2).max(255),
  phone_number: z.string().min(8).max(20),
  whatsapp_number: z.string().min(8).max(20),
  email: z.string().email().max(255),
  location: z.string().min(2).max(255),
  course_id: z.string().min(2).max(100),
  backend_preference: z.string().max(100).optional(),
  previous_knowledge: z.boolean(),
  education_level: z.string().max(255).optional(),
  experience_level: z.string().max(255).optional(),
  motivation: z.string().max(2000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const key = `register:${getClientKey(request)}`
    const rl = checkRateLimit(key, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 })
    }
    const v = parsed.data

    let courseObj: { id: string; title: string; totalFee: number; requiredDeposit: number } | undefined = undefined

    // Check dynamic courses from Supabase database first
    const { data: dbCourse } = await supabaseAdmin
      .from("courses")
      .select("id, title, total_fee, required_deposit, is_active")
      .eq("id", v.course_id)
      .single()

    if (dbCourse) {
      if (dbCourse.is_active === false) {
        return Response.json({ error: "This course is currently unavailable for registration." }, { status: 400 })
      }
      courseObj = {
        id: dbCourse.id,
        title: dbCourse.title,
        totalFee: Number(dbCourse.total_fee),
        requiredDeposit: Number(dbCourse.required_deposit),
      }
    } else if (Object.prototype.hasOwnProperty.call(COURSES_CATALOG, v.course_id)) {
      const catalogCourse = COURSES_CATALOG[v.course_id]
      if (catalogCourse.isActive === false) {
        return Response.json({ error: "This course is currently unavailable for registration." }, { status: 400 })
      }
      courseObj = catalogCourse
    }

    if (!courseObj) {
      return Response.json({ error: "Course not found or unavailable" }, { status: 400 })
    }

    const payload = {
      full_name: sanitizeText(v.full_name),
      phone_number: digitsOnly(v.phone_number),
      whatsapp_number: digitsOnly(v.whatsapp_number),
      email: sanitizeText(v.email).toLowerCase(),
      location: sanitizeText(v.location),
      course_selection: courseObj.title,
      course_id: courseObj.id,
      backend_preference: sanitizeText(v.backend_preference ?? ""),
      total_fee: courseObj.totalFee,
      required_deposit: courseObj.requiredDeposit,
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

    // Confirmation + admin alert are sent server-side from the validated record, so no public
    // "send an email to anyone" endpoint is needed. Failures never block the registration.
    const emailJobs: Promise<unknown>[] = [
      sendEmail({
        to: payload.email,
        subject: `Welcome to Gh0sT Tech! - ${payload.course_selection} Registration`,
        html: emailTemplates.registration(
          payload.full_name,
          payload.course_selection,
          payload.required_deposit,
          payload.backend_preference || undefined,
        ),
      }),
    ]
    const adminEmail = process.env.ADMIN_EMAIL?.trim().replace(/^["']|["']$/g, "")
    if (adminEmail) {
      emailJobs.push(
        sendEmail({
          to: adminEmail,
          subject: `🚨 New Student Registration: ${payload.full_name} (${payload.course_selection})`,
          html: emailTemplates.adminAlert({
            full_name: payload.full_name,
            email: payload.email,
            course_selection: payload.course_selection,
            backend_preference: payload.backend_preference,
            phone_number: payload.phone_number,
            whatsapp_number: payload.whatsapp_number,
            location: payload.location,
          }),
        }),
      )
    }
    const results = await Promise.allSettled(emailJobs)
    results.forEach((r) => {
      if (r.status === "rejected") console.error("Registration email error:", r.reason)
    })

    return Response.json(
      { id, required_deposit: payload.required_deposit, total_fee: payload.total_fee },
      { status: 201 },
    )
  } catch (e) {
    console.error("Registrations create error:", e)
    return Response.json({ error: "Unexpected error" }, { status: 500 })
  }
}
