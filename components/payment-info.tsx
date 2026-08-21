import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, CreditCard, CheckCircle2 } from "lucide-react"
import { ALL_COURSES } from "@/lib/courses-data"

export function PaymentInfo() {
  const methods = ["MTN Mobile Money", "Telecel (Vodafone) Cash", "AirtelTigo Money", "Paystack Online Payment"]

  return (
    <section className="px-4 py-16 bg-muted/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Tuition Fees & Payment Options</h2>
          <p className="text-foreground/70 max-w-xl mx-auto">
            Flexible Mobile Money payment options. Secure your seat with a deposit; the balance is due before your first lab session.
          </p>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_COURSES.map((course) => (
            <Card key={course.id} className="border-primary/20 bg-card/60 backdrop-blur-md flex flex-col justify-between">
              <CardHeader className="pb-3">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border w-fit mb-2 ${course.badgeClass}`}>
                  {course.duration}
                </span>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Total Tuition:</span>
                    <span className="text-2xl font-bold text-foreground">GHS {course.totalFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-primary font-medium mt-1">
                    <span>Required Deposit:</span>
                    <span>GHS {course.requiredDeposit}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1 border-t border-primary/10 pt-1">
                    <span>Remaining Balance:</span>
                    <span>GHS {course.totalFee - course.requiredDeposit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Accepted Mobile Money & Payment Methods</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {methods.map((m, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <CreditCard className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-medium">{m}</p>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Payments are processed securely via Paystack. Official receipts are issued via email immediately upon transaction completion.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
