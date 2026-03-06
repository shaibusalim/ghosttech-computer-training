import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, CreditCard } from "lucide-react"

export function PaymentInfo() {
  const methods = ["MTN Mobile Money", "Telecel Cash", "AirtelTigo Money", "Paystack online payment"]

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Payment Information</h2>
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <CardTitle>Local and Secure Options</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {methods.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <p className="text-sm">{m}</p>
              </div>
            ))}
            <p className="sm:col-span-2 text-xs text-foreground/60 pt-2">Deposit GHS 300 to reserve. Balance due before training starts.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
