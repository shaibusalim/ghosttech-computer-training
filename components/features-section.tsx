"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Cpu, Bot, Award, Users, Code2 } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Practical Hands-On Labs",
    description: "Every cohort is centered around physical hardware repairs, live code creation, and real-world system troubleshooting.",
  },
  {
    icon: Bot,
    title: "Integrated AI Tooling & Prompting",
    description: "All Web Development tracks incorporate cutting-edge AI tools (V0.dev, GitHub Copilot, ChatGPT) for accelerated learning.",
  },
  {
    icon: Code2,
    title: "Multi-Track Specialization",
    description: "Choose specialized tracks in Hardware Systems, Office Productivity, or Full-Stack Web Development tailored to your goals.",
  },
  {
    icon: Cpu,
    title: "Real System & App Deployment",
    description: "Build live web applications or assemble real computers with clean OS installations, domain setups, and SSL security.",
  },
  {
    icon: Award,
    title: "Verified Academy Certificates",
    description: "Earn an official Gh0sT Tech Academy completion certificate validating your practical IT & software engineering skills.",
  },
  {
    icon: Users,
    title: "Small Cohorts & Direct Support",
    description: "Limited class sizes ensure personalized instructor attention, code reviews, and hands-on lab time for every student.",
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
            <p className="text-xs font-semibold text-primary tracking-wide">Why Gh0sT Tech Academy</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Designed Like an Enterprise IT Academy</h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            A modern, cohort-based learning center focused on high-demand practical skills you can immediately monetize in jobs, freelancing, or tech entrepreneurship.
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
                className="group relative h-full overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-800/50 p-6 shadow-xl backdrop-blur"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18)_0,transparent_55%)]" />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 shadow-inner shadow-primary/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{feature.description}</p>
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
