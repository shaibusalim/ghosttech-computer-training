import { getAdminDb } from "@/lib/firebase/admin"

export async function POST(request: Request) {
  try {
    const {
      full_name,
      phone_number,
      whatsapp_number,
      email,
      location,
      previous_knowledge
    } = await request.json()

    // Validate required fields
    if (
      !full_name ||
      !phone_number ||
      !whatsapp_number ||
      !email ||
      !location ||
      previous_knowledge === undefined
    ) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    const db = getAdminDb()

    // Save to Firestore
    const docRef = await db.collection("registrations").add({
      full_name,
      phone_number,
      whatsapp_number,
      email,
      location,
      courses: ["hardware", "software", "networking"],
      previous_knowledge: previous_knowledge === "yes",
      created_at: Date.now(),
    })

    // Send confirmation email to user
    try {
      const confirmationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name,
          courses: ["hardware", "software", "networking"],
        }),
      })

      if (!confirmationResponse.ok) {
        console.error("Failed to send confirmation email to user")
      }
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
    }

    // Send notification email to admin
    try {
      const adminNotificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-admin-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name,
          phone_number,
          whatsapp_number,
          email,
          location,
          previous_knowledge: previous_knowledge === "yes",
          registration_id: docRef.id,
        }),
      })

      if (!adminNotificationResponse.ok) {
        console.error("Failed to send admin notification email")
      }
    } catch (emailError) {
      console.error("Error sending admin notification email:", emailError)
    }

    return Response.json({
      success: true,
      registration_id: docRef.id
    }, { status: 200 })

  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Registration failed" }, { status: 500 })
  }
}
