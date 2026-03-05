"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, Phone, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function PaymentForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const registrationId = searchParams.get("registrationId")
  
  const [initializing, setInitializing] = useState(false)
  
  // Payment Details
  const [momoNumber, setMomoNumber] = useState("")
  const [momoProvider, setMomoProvider] = useState<string>("")
  
  const FIXED_DEPOSIT = 300 // GHS

  const handleMomoPayment = async () => {
    if (!registrationId || !momoNumber || !momoProvider) {
      toast({
        title: "Missing Info",
        description: "Please provide your Mobile Money number and select a provider.",
        variant: "destructive",
      })
      return
    }

    try {
      setInitializing(true)
      const resp = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          registrationId, 
          amount: FIXED_DEPOSIT * 100, // in kobo
          momoNumber,
          momoProvider 
        }),
      })

      const json = await resp.json()
      
      if (!resp.ok) {
        toast({
          title: "Payment error",
          description: json.error || "Could not start payment. Please try again.",
          variant: "destructive",
        })
        return
      }
      
      if (json.authorization_url) {
        window.location.href = json.authorization_url as string
      } else {
        router.push(`/register/payment/callback?registrationId=${registrationId}&reference=${json.reference}`)
      }
      
    } catch (err) {
      console.error("Paystack initialize error", err)
      toast({
        title: "Payment error",
        description: "Something went wrong while starting the payment process.",
        variant: "destructive",
      })
    } finally {
      setInitializing(false)
    }
  }

  if (!registrationId) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
          <CardDescription>Missing registration information. Please try registering again.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md w-full border-primary/20 shadow-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Confirm Registration</CardTitle>
            <CardDescription>Pay deposit to secure your seat</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Total Fee:</span>
            <span className="font-semibold">GHS 700.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Required Deposit:</span>
            <span className="font-bold text-primary">GHS {FIXED_DEPOSIT}.00</span>
          </div>
          <p className="text-[10px] text-foreground/40 pt-2 border-t border-primary/10">
            *The remaining GHS 400.00 is payable before training starts.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Select Mobile Money Provider</Label>
            <Select onValueChange={(val) => setMomoProvider(val)}>
              <SelectTrigger id="provider" className="w-full">
                <SelectValue placeholder="Choose provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="vodafone">Telecel (Vodafone) Cash</SelectItem>
                <SelectItem value="tigo">AirtelTigo Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="momo_number">Momo Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="momo_number"
                placeholder="024 000 0000" 
                className="pl-10"
                type="tel"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all py-6 h-auto text-lg font-bold"
            onClick={handleMomoPayment}
            disabled={initializing || !momoNumber || !momoProvider}
          >
            {initializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Prompt...
              </>
            ) : (
              "Confirm & Pay GHS 300"
            )}
          </Button>
          
          <p className="text-center text-[11px] text-foreground/50 flex items-center justify-center gap-1">
            <CreditCard className="h-3 w-3" /> 
            Secured by Paystack. You will receive a prompt on your phone.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentForm />
      </Suspense>
    </main>
  )
}
