import { NextRequest } from "next/server"
import crypto from "crypto"
import { getPaystackSecret, isUuid, isValidReference, recordPaystackPayment } from "@/lib/payments"

/** Paystack webhook. Authenticated solely by the HMAC signature of the raw body. */
export async function POST(request: NextRequest) {
  const secret = getPaystackSecret()
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not configured")
    return Response.json({ error: "Server configuration error" }, { status: 500 })
  }

  const signature = request.headers.get("x-paystack-signature") || ""
  const body = await request.text()

  const expected = crypto.createHmac("sha512", secret).update(body).digest("hex")
  const sigBuf = Buffer.from(signature, "utf8")
  const expBuf = Buffer.from(expected, "utf8")
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: any
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (event?.event !== "charge.success") {
    return Response.json({ status: "ignored" }, { status: 200 })
  }

  const { reference, amount, currency, metadata } = event.data ?? {}
  const registrationId = metadata?.registrationId

  // Ack (200) unusable events so Paystack doesn't retry them forever.
  if (!isValidReference(reference) || !isUuid(registrationId) || !Number.isFinite(Number(amount))) {
    console.warn("Ignoring charge.success with missing/invalid data")
    return Response.json({ status: "ignored" }, { status: 200 })
  }

  const result = await recordPaystackPayment({
    registrationId,
    reference,
    amountKobo: Number(amount),
    currency: String(currency || ""),
  })

  if (!result.ok) {
    if (result.code === "db") {
      // Let Paystack retry transient failures.
      return Response.json({ error: result.message }, { status: 500 })
    }
    console.warn("Paystack webhook rejected:", result.code, registrationId)
    return Response.json({ status: "ignored" }, { status: 200 })
  }

  return Response.json({ status: "success" }, { status: 200 })
}
