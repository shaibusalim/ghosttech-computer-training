"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Cpu, 
  Monitor, 
  Wrench, 
  ShieldCheck, 
  Settings, 
  Database, 
  Wifi, 
  Globe, 
  Laptop, 
  Lightbulb,
  CheckCircle2
} from "lucide-react"

const TOPICS = [
  {
    title: "Computer Hardware Fundamentals",
    desc: "Master the physical components that make a computer run.",
    icon: Cpu,
  },
  {
    title: "Operating System Installation",
    desc: "Learn to install and configure Windows and Linux distributions.",
    icon: Monitor,
  },
  {
    title: "Software Troubleshooting",
    desc: "Diagnose and resolve common application and system errors.",
    icon: Wrench,
  },
  {
    title: "Virus Removal & System Security",
    desc: "Keep systems safe from malware and security threats.",
    icon: ShieldCheck,
  },
  {
    title: "Computer Maintenance",
    desc: "Optimize system performance with regular maintenance routines.",
    icon: Settings,
  },
  {
    title: "Data Backup & Recovery",
    desc: "Protect and recover critical information from failing systems.",
    icon: Database,
  },
  {
    title: "Basic Networking Concepts",
    desc: "Understand how devices communicate within a network.",
    icon: Wifi,
  },
  {
    title: "Router & Internet Setup",
    desc: "Configure local networks and high-speed internet access.",
    icon: Globe,
  },
  {
    title: "Repair Basics",
    desc: "Hands-on techniques for laptop and desktop hardware repair.",
    icon: Laptop,
  },
  {
    title: "Real-world IT Problem Solving",
    desc: "Apply your skills to solve complex, practical IT challenges.",
    icon: Lightbulb,
  },
]

const SKILLS = [
  "Diagnose computer hardware problems",
  "Install and configure operating systems",
  "Fix slow or malfunctioning computers",
  "Remove viruses and malware",
  "Perform routine computer maintenance",
  "Set up home or small office networks",
  "Configure routers and internet connections",
  "Install and update software correctly",
  "Troubleshoot system errors confidently",
  "Maintain and optimize computer performance",
]

export function ProgramOutcomes() {
  return (
    <section className="px-4 py-20 bg-accent/5">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Subsection 1: What This Program Is About */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What This Program Is About</h2>
            <p className="text-foreground/70 text-lg leading-relaxed">
              This program is designed to give students practical, real-world computer repair and IT troubleshooting skills. 
              You will learn how computers work, how to diagnose problems, fix hardware and software issues, and set up networks. 
              The training focuses on hands-on experience so that by the end of the program you can confidently repair and maintain computers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {TOPICS.map((topic, i) => {
              const Icon = topic.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-primary/10 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {topic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-foreground/60 leading-relaxed">
                        {topic.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Subsection 2: Skills You Will Walk Away With */}
        <div className="space-y-12 pt-10 border-t border-primary/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills You Will Walk Away With</h2>
            <p className="text-primary font-medium text-lg">After completing this program, students will be able to:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl mx-auto">
            {SKILLS.map((skill, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-foreground/80 font-medium">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
