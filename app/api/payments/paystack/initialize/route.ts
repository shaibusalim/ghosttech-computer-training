import { NextRequest } from "next/server"
import { getAdminDb } from "@/lib/firebase/admin"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { registrationId, amount, momoNumber, momoProvider } = await request.json()

    if (!registrationId || !amount) {
      return Response.json({ error: "Missing registrationId or amount" }, { status: 400 })
    }

    const db = getAdminDb()
    const docRef = db.collection("registrations").doc(registrationId)
    const doc = await docRef.get()

    if (!doc.exists) {
      return Response.json({ error: "Registration not found" }, { status: 404 })
    }

    const registrationData = doc.data()
    if (!registrationData) {
        return Response.json({ error: "Registration data not found" }, { status: 404 })
    }

    const { email, full_name } = registrationData

    // If momo details are provided, we can try to initialize with mobile_money channel
    const paystackBody: any = {
      email,
      amount,
      metadata: {
        full_name,
        registrationId,
        custom_fields: [
          {
            display_name: "Registration ID",
            variable_name: "registration_id",
            value: registrationId
          }
        ]
      },
      channels: ['mobile_money'],
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/payment/callback?registrationId=${registrationId}`,
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
      return Response.json({ error: paystackData.message || "Failed to initialize Paystack transaction" }, { status: 500 })
    }

    return Response.json({ authorization_url: paystackData.data.authorization_url }, { status: 200 })

  } catch (error) {
    console.error("Error initializing Paystack transaction:", error)
    return Response.json({ error: "Failed to initialize Paystack transaction" }, { status: 500 })
  }
}
