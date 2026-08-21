import { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { registrationId, amount: clientAmount, momoNumber, momoProvider } = await request.json()

    if (!registrationId) {
      return Response.json({ error: "Missing registrationId" }, { status: 400 })
    }

    const { data: registrationData, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('email, full_name, required_deposit, total_fee, course_selection')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registrationData) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const { email, full_name, required_deposit, total_fee, course_selection } = registrationData

    // Use required_deposit from database if present, otherwise fall back to client passed amount or default 300 GHS
    const depositGHS = required_deposit ? Number(required_deposit) : (clientAmount ? Number(clientAmount) / 100 : 300)
    const amountInKobo = Math.round(depositGHS * 100)

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const paystackBody: any = {
      email,
      amount: amountInKobo,
      metadata: {
        full_name,
        registrationId,
        course_selection,
        custom_fields: [
          {
            display_name: "Registration ID",
            variable_name: "registration_id",
            value: registrationId
          },
          {
            display_name: "Course Selection",
            variable_name: "course_selection",
            value: course_selection || "Tech Training"
          }
        ]
      },
      channels: ['mobile_money', 'card'],
      callback_url: `${baseUrl}/register/payment/callback?registrationId=${registrationId}`,
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackBody),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      console.error("Paystack API error:", paystackData)
      return Response.json({ error: paystackData.message || "Failed to initialize Paystack transaction" }, { status: 500 })
    }

    return Response.json({ authorization_url: paystackData.data.authorization_url, amount: depositGHS }, { status: 200 })

  } catch (error) {
    console.error("Error initializing Paystack transaction:", error)
    return Response.json({ error: "Failed to initialize Paystack transaction" }, { status: 500 })
  }
}
