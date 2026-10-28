import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"
import { checkRateLimit, getClientKey } from "@/lib/utils"
import { getCourseById } from "@/lib/courses-data"
import { PAYSTACK_CURRENCY, getPaystackSecret, isUuid } from "@/lib/payments"

export async function POST(request: NextRequest) {
  try {
    const rl = checkRateLimit(`pay-init:${getClientKey(request)}`, 15, 10 * 60 * 1000)
    if (!rl.allowed) {
      return Response.json({ error: "Too many requests" }, { status: 429 })
    }

    const secret = getPaystackSecret()
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is not configured")
      return Response.json({ error: "Server configuration error" }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    const registrationId = body?.registrationId

    if (!isUuid(registrationId)) {
      return Response.json({ error: "Missing or invalid registrationId" }, { status: 400 })
    }

    const { data: registrationData, error: fetchError } = await supabaseAdmin
      .from("registrations")
      .select("email, full_name, course_id, required_deposit, course_selection, payment_status, status")
      .eq("id", registrationId)
      .single()

    if (fetchError || !registrationData) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const { email, full_name, course_id, required_deposit, course_selection, payment_status, status } = registrationData

    if (payment_status === "full" || status === "approved") {
      return Response.json({ error: "This registration is already paid" }, { status: 400 })
    }

    // The amount is decided by the server only. Any client-supplied amount is ignored.
    const course = getCourseById(course_id || "")
    const depositGHS = Number(required_deposit) || course.requiredDeposit
    const amountInKobo = Math.round(depositGHS * 100)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const paystackBody = {
      email,
      amount: amountInKobo,
      currency: PAYSTACK_CURRENCY,
      metadata: {
        full_name,
        registrationId,
        course_selection,
        custom_fields: [
          {
            display_name: "Registration ID",
            variable_name: "registration_id",
            value: registrationId,
          },
          {
            display_name: "Course Selection",
            variable_name: "course_selection",
            value: course_selection || "Tech Training",
          },
        ],
      },
      channels: ["mobile_money", "card"],
      callback_url: `${baseUrl}/register/payment/callback?registrationId=${registrationId}`,
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackBody),
    })

    const paystackData = await paystackResponse.json().catch(() => null)

    if (!paystackResponse.ok || !paystackData?.data?.authorization_url) {
      console.error("Paystack API error:", paystackData)
      return Response.json({ error: "Failed to initialize Paystack transaction" }, { status: 502 })
    }

    return Response.json(
      {
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
        amount: depositGHS,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error)
    return Response.json({ error: "Failed to initialize Paystack transaction" }, { status: 500 })
  }
}
