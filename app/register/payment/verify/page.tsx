"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const registrationId = searchParams.get("registrationId")
  const trxref = searchParams.get("trxref")
  const reference = searchParams.get("reference")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your payment...")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!registrationId || (!trxref && !reference)) {
        setStatus("error")
        setMessage("Invalid payment details. Please try again.")
        return
      }

      try {
        const resp = await fetch("/api/payments/paystack/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId, reference: trxref || reference }),
        })

        const json = await resp.json()

        if (!resp.ok) {
          setStatus("error")
          setMessage(json.error || "Failed to verify payment. Please contact support.")
          return
        }

        setStatus("success")
        setMessage("Payment verified successfully! Your seat is booked.")
        toast({ title: "Payment Successful", description: "Your registration is complete." })

        setTimeout(() => {
          router.push("/registration-success")
        }, 3000)

      } catch (err) {
        console.error("Payment verification error", err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please contact support.")
      }
    }

    verifyPayment()
  }, [registrationId, trxref, reference, router, toast])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              {status === "loading" && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
              {status === "success" && <ShieldCheck className="h-5 w-5 text-green-500" />}
              {status === "error" && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </div>
            <div>
              <CardTitle>
                {status === "loading" && "Verifying Payment"}
                {status === "success" && "Payment Successful"}
                {status === "error" && "Payment Failed"}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </div>
          </div>
        </CardHeader>
        {status !== "loading" && (
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">Go to Homepage</Button>
          </CardContent>
        )}
      </Card>
    </main>
  )
}
