import { NextRequest } from "next/server"
import { checkRateLimit, getClientKey } from "@/lib/utils"
import { getPaystackSecret, isUuid, isValidReference, recordPaystackPayment } from "@/lib/payments"

export async function POST(request: NextRequest) {
  try {
    const rl = checkRateLimit(`verify-payment:${getClientKey(request)}`, 20, 10 * 60 * 1000)
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
    const reference = body?.reference

    if (!isUuid(registrationId) || !isValidReference(reference)) {
      return Response.json({ error: "Missing or invalid registrationId or reference" }, { status: 400 })
    }

    // Never trust the client: ask Paystack whether this reference really succeeded.
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
    )
    const paystackData = await paystackResponse.json().catch(() => null)

    if (!paystackResponse.ok || !paystackData?.data || paystackData.data.status !== "success") {
      return Response.json(
        { error: paystackData?.data?.gateway_response || "Payment not successful" },
        { status: 400 },
      )
    }

    const { amount, currency, metadata } = paystackData.data

    if (metadata?.registrationId !== registrationId) {
      return Response.json({ error: "Invalid registration ID" }, { status: 400 })
    }

    const result = await recordPaystackPayment({
      registrationId,
      reference,
      amountKobo: Number(amount),
      currency: String(currency || ""),
    })

    if (!result.ok) {
      const status = result.code === "not_found" ? 404 : result.code === "db" ? 500 : 400
      return Response.json({ error: result.message }, { status })
    }

    return Response.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error)
    return Response.json({ error: "Failed to verify Paystack transaction" }, { status: 500 })
  }
}
