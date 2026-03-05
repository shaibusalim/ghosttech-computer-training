"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Cpu, Bug, Award, Users } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "70% Practical Training",
    description: "Every cohort is built around labs, repairs, and real troubleshooting — not just theory on slides.",
  },
  {
    icon: Cpu,
    title: "Real System Installation",
    description: "Install and configure Windows on real machines, including disk partitioning and driver setup.",
  },
  {
    icon: Bug,
    title: "Virus Removal & Recovery",
    description: "Work on actual infected systems, remove malware, and restore safe, stable performance.",
  },
  {
    icon: Award,
    title: "Certificate After Completion",
    description: "Earn a Gh0sTTech completion certificate that validates your hands-on IT skills.",
  },
  {
    icon: Users,
    title: "Limited Seats Per Cohort",
    description: "Small class sizes so you get direct support, feedback, and more time on each PC.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14"
        >
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
            <p className="text-xs font-semibold text-primary tracking-wide">Why Gh0sTTech Training</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Designed Like a Real IT Academy</h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            A structured, cohort-based program focused on practical skills you can use immediately in jobs, freelancing,
            or your own repair business.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.06 },
                  },
                }}
                className="group relative h-full overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-slate-900/70 via-slate-900/40 to-slate-800/40 p-5 shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18)_0,transparent_55%)]" />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 shadow-inner shadow-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

