import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, GraduationCap, Wrench } from "lucide-react"

export function WhoThisTraining() {
  const items = [
    {
      icon: User,
      title: "Beginners",
      desc: "Start from zero and build confidence with guided practicals",
      color: "from-primary/20 to-primary/10",
    },
    {
      icon: Briefcase,
      title: "Career Switchers",
      desc: "Gain real skills to move into IT support and repair",
      color: "from-accent/20 to-accent/10",
    },
    {
      icon: GraduationCap,
      title: "Students",
      desc: "Strengthen fundamentals to complement classroom learning",
      color: "from-emerald-400/20 to-emerald-400/10",
    },
    {
      icon: Wrench,
      title: "Technicians",
      desc: "Upgrade troubleshooting speed with proven workflows",
      color: "from-indigo-400/20 to-indigo-400/10",
    },
  ]

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Who This Training Is For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <Card key={i} className="border-primary/20 bg-gradient-to-br rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
              >
                <CardHeader className={`bg-gradient-to-br ${item.color} rounded-t-xl`}>
                  <div className="w-10 h-10 rounded-full bg-card/60 border border-primary/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="mt-3 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-foreground/70 pt-4">{item.desc}</CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
