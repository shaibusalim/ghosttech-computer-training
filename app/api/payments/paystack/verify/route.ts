import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"
import crypto from "crypto"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-paystack-signature")
  const body = await request.text()

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex")

  if (hash !== signature) {
    return Response.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === "charge.success") {
    const { reference, amount, metadata } = event.data
    const { registrationId } = metadata

    try {
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
      console.error("Error updating registration payment status:", error)
      return Response.json({ error: "Failed to update payment status" }, { status: 500 })
    }
  }

  return Response.json({ status: "ignored" }, { status: 200 })
}
