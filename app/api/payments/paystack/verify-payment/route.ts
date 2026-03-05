import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { registrationId, reference } = await request.json()

    if (!registrationId || !reference) {
      return Response.json({ error: "Missing registrationId or reference" }, { status: 400 })
    }

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.data || paystackData.data.status !== "success") {
      return Response.json({ error: paystackData.data.gateway_response || "Payment not successful" }, { status: 400 })
    }

    const { amount, metadata } = paystackData.data

    if (metadata.registrationId !== registrationId) {
      return Response.json({ error: "Invalid registration ID" }, { status: 400 })
    }

    const db = getAdminDb()
    const docRef = db.collection("registrations").doc(registrationId)

    await docRef.update({
      payment_status: amount === 70000 ? "full" : "partial",
      payment_amount: amount / 100, // convert from kobo to GHS
      payment_reference: reference,
      payment_method: "paystack",
      payment_confirmed_at: new Date().toISOString(),
    })

    return Response.json({ status: "success" }, { status: 200 })

  } catch (error) {
    console.error("Error verifying Paystack transaction:", error)
    return Response.json({ error: "Failed to verify Paystack transaction" }, { status: 500 })
  }
}
