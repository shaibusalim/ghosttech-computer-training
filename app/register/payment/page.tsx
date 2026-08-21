"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, Phone, CreditCard, CheckCircle2 } from "lucide-react"
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
  const [momoNumber, setMomoNumber] = useState("")
  const [momoProvider, setMomoProvider] = useState<string>("")
  
  const [registrationData, setRegistrationData] = useState<{
    course_selection?: string
    total_fee?: number
    required_deposit?: number
    full_name?: string
  } | null>(null)
  const [loadingReg, setLoadingReg] = useState(true)

  useEffect(() => {
    if (!registrationId) {
      setLoadingReg(false)
      return
    }

    fetch(`/api/registrations/${registrationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load registration")
        return res.json()
      })
      .then((data) => {
        if (data.registration) {
          setRegistrationData(data.registration)
        }
      })
      .catch((err) => {
        console.error("Error loading registration for payment:", err)
      })
      .finally(() => {
        setLoadingReg(false)
      })
  }, [registrationId])

  const requiredDeposit = registrationData?.required_deposit || 300
  const totalFee = registrationData?.total_fee || 700

  const handleMomoPayment = async () => {
    if (!registrationId || !momoNumber || !momoProvider) {
      toast({
        title: "Missing Information",
        description: "Please enter your Mobile Money number and select a network provider.",
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
          amount: requiredDeposit * 100, // in kobo
          momoNumber,
          momoProvider 
        }),
      })

      const json = await resp.json()
      
      if (!resp.ok) {
        toast({
          title: "Payment Initialization Failed",
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
        title: "Payment Error",
        description: "An error occurred while connecting to Paystack. Please try again.",
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
          <CardDescription>Missing registration record. Please complete registration first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md w-full border-primary/20 shadow-2xl bg-card">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Confirm Registration</CardTitle>
            <CardDescription>Pay seat deposit to finalize registration</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {loadingReg ? (
          <div className="text-center py-6">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-2">Loading course details...</p>
          </div>
        ) : (
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/15 space-y-2">
            {registrationData?.course_selection && (
              <div className="border-b border-primary/10 pb-2 mb-2">
                <span className="text-xs font-semibold uppercase text-primary tracking-wider">Target Course</span>
                <p className="font-bold text-base text-foreground">{registrationData.course_selection}</p>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Total Tuition Fee:</span>
              <span className="font-semibold">GHS {totalFee}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Required Seat Deposit:</span>
              <span className="font-bold text-primary text-base">GHS {requiredDeposit}.00</span>
            </div>
            <p className="text-[11px] text-foreground/50 pt-2 border-t border-primary/10">
              *The balance of GHS {totalFee - requiredDeposit}.00 is payable before your first practical session.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Select Mobile Money Provider</Label>
            <Select onValueChange={(val) => setMomoProvider(val)}>
              <SelectTrigger id="provider" className="w-full">
                <SelectValue placeholder="Choose Network Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                <SelectItem value="vodafone">Telecel (Vodafone) Cash</SelectItem>
                <SelectItem value="tigo">AirtelTigo Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="momo_number">Mobile Money Phone Number</Label>
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
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all py-6 h-auto text-lg font-bold shadow-lg"
            onClick={handleMomoPayment}
            disabled={initializing || !momoNumber || !momoProvider || loadingReg}
          >
            {initializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting to Paystack...
              </>
            ) : (
              `Pay GHS ${requiredDeposit} Deposit Now`
            )}
          </Button>
          
          <p className="text-center text-[11px] text-foreground/50 flex items-center justify-center gap-1">
            <CreditCard className="h-3.5 w-3.5" /> 
            Secured by Paystack. You will receive a Mobile Money PIN prompt.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background py-12">
      <Suspense fallback={<div className="text-center">Loading payment gateway...</div>}>
        <PaymentForm />
      </Suspense>
    </main>
  )
}
