"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function PaystackCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reference = searchParams.get("reference")

  useEffect(() => {
    async function runVerify() {
      if (!reference) {
        setError("Missing transaction reference.")
        setVerifying(false)
        return
      }
      try {
        const resp = await fetch(`/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`)
        const json = await resp.json()
        if (!resp.ok || !json.success) {
          setError(json.error || "Unable to verify payment.")
          setVerifying(false)
          return
        }
        toast({
          title: "Payment successful",
          description: "Your payment has been verified. An admin will confirm your seat shortly.",
        })
        router.replace("/registration-success")
      } catch (err) {
        console.error("Verify error", err)
        setError("Something went wrong while verifying payment.")
        setVerifying(false)
      }
    }
    runVerify()
  }, [reference, router, toast])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Verifying Payment</CardTitle>
              <CardDescription>
                {reference ? `Reference: ${reference}` : "Checking your transaction details."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {verifying && (
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Please wait while we confirm your payment with Paystack.</p>
            </div>
          )}
          {!verifying && error && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-destructive">{error}</p>
              <Button size="sm" variant="outline" onClick={() => router.push("/register")}>
                Go back to registration
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

