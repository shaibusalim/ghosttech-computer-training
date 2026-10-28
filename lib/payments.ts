import { supabaseAdmin } from "@/lib/supabase/server"
import { getCourseById } from "@/lib/courses-data"
import { sendEmail, emailTemplates } from "@/lib/email-utils"

export const PAYSTACK_CURRENCY = "GHS"

export function getPaystackSecret(): string | null {
  const key = process.env.PAYSTACK_SECRET_KEY
  return key && key.length > 0 ? key : null
}

/** Paystack references are short URL-safe tokens; reject anything else before it reaches a URL. */
export function isValidReference(ref: unknown): ref is string {
  return typeof ref === "string" && /^[A-Za-z0-9_.=-]{4,100}$/.test(ref)
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export function isUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v)
}

type RecordResult =
  | { ok: true; alreadyRecorded: boolean; paymentStatus: "full" | "partial" }
  | { ok: false; code: "not_found" | "amount_too_low" | "currency" | "db"; message: string }

/**
 * Records a *verified* Paystack payment against a registration.
 *
 * Amounts are always judged against the fee stored on the server (never a hard-coded
 * number or a client value), the call is idempotent per payment reference, and it never
 * regresses a registration that an admin already approved.
 */
export async function recordPaystackPayment(input: {
  registrationId: string
  reference: string
  amountKobo: number
  currency: string
}): Promise<RecordResult> {
  const { registrationId, reference, amountKobo, currency } = input

  if (currency !== PAYSTACK_CURRENCY) {
    return { ok: false, code: "currency", message: "Unexpected payment currency" }
  }

  const { data: reg, error: fetchError } = await supabaseAdmin
    .from("registrations")
    .select("id, email, full_name, course_id, total_fee, required_deposit, status, payment_status, payment_reference")
    .eq("id", registrationId)
    .single()

  if (fetchError || !reg) {
    return { ok: false, code: "not_found", message: "Registration not found" }
  }

  const course = getCourseById(reg.course_id || "")
  const totalFee = Number(reg.total_fee) || course.totalFee
  const requiredDeposit = Number(reg.required_deposit) || course.requiredDeposit

  if (amountKobo < Math.round(requiredDeposit * 100)) {
    return { ok: false, code: "amount_too_low", message: "Amount is below the required deposit" }
  }

  const isFull = amountKobo >= Math.round(totalFee * 100)
  const paymentStatus: "full" | "partial" = isFull || reg.payment_status === "full" ? "full" : "partial"

  if (reg.payment_reference === reference) {
    return { ok: true, alreadyRecorded: true, paymentStatus }
  }

  const update: Record<string, unknown> = {
    payment_status: paymentStatus,
    payment_amount: amountKobo / 100, // kobo -> GHS
    payment_reference: reference,
    payment_method: "paystack",
    payment_confirmed_at: new Date().toISOString(),
  }
  // Only move forward from pending_payment; never overwrite approved/awaiting states.
  if (isFull && reg.status === "pending_payment") {
    update.status = "awaiting_admin_approval"
  }

  const { error: updateError } = await supabaseAdmin.from("registrations").update(update).eq("id", registrationId)
  if (updateError) {
    console.error("Failed to record payment:", updateError)
    return { ok: false, code: "db", message: "Failed to update payment status" }
  }

  try {
    const amountText = isFull
      ? `Full payment received: GHS ${totalFee}`
      : `Part payment received: GHS ${amountKobo / 100}`
    await sendEmail({
      to: reg.email,
      subject:
        paymentStatus === "full"
          ? "✅ Payment Confirmed - Full Payment Received"
          : "🟡 Payment Confirmed - Part Payment Received",
      html: emailTemplates.payment(reg.full_name, paymentStatus, amountText),
    })
  } catch (emailError) {
    console.error("Error sending payment confirmation email:", emailError)
  }

  return { ok: true, alreadyRecorded: false, paymentStatus }
}
