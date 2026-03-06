import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Plug, NotebookPen, Brain, Cpu, Wrench, Hammer, Users } from "lucide-react"

export function NeedsProvideSection() {
  const needs = [
    { icon: Laptop, label: "Laptop or Desktop" },
    { icon: Plug, label: "Charger" },
    { icon: NotebookPen, label: "Notebook" },
    { icon: Brain, label: "Willingness to learn" },
  ]
  const provides = [
    { icon: Cpu, label: "Practical training environment" },
    { icon: Cpu, label: "Practice computers" },
    { icon: Wrench, label: "Repair tools" },
    { icon: Users, label: "Mentorship" },
  ]

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xl">What You Need</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {needs.map((n, i) => {
              const Icon = n.icon
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 hover:bg-primary/10 transition">
                  <div className="w-9 h-9 rounded-md bg-card/60 border border-primary/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm">{n.label}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-accent/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader>
            <CardTitle className="text-xl">What We Provide</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {provides.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2 hover:bg-accent/10 transition">
                  <div className="w-9 h-9 rounded-md bg-card/60 border border-accent/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm">{p.label}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
