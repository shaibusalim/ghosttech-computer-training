"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Cpu, 
  Monitor, 
  Wrench, 
  ShieldCheck, 
  FileSpreadsheet, 
  Database, 
  Wifi, 
  Code2, 
  Bot, 
  Sparkles,
  CheckCircle2
} from "lucide-react"

const TOPICS = [
  {
    title: "Computer Hardware & Diagnostics",
    desc: "Master physical components, RAM, CPUs, PSUs, disassembly & rebuilding.",
    icon: Cpu,
  },
  {
    title: "OS Installation & Driver Config",
    desc: "Deploy Windows 10/11 OS, driver packages & BIOS/UEFI settings.",
    icon: Monitor,
  },
  {
    title: "Malware Removal & Virus Cleaning",
    desc: "Purge deep malware infections, optimize registry & secure systems.",
    icon: ShieldCheck,
  },
  {
    title: "Office Productivity & MS Excel",
    desc: "Create professional documents, automated Excel formulas & pitch decks.",
    icon: FileSpreadsheet,
  },
  {
    title: "Frontend Web Foundations",
    desc: "Build responsive websites with HTML5, CSS3, Flexbox, Grid & ES6+ JavaScript.",
    icon: Code2,
  },
  {
    title: "Modern React & Next.js Frameworks",
    desc: "Architect interactive web apps with React 19, Next.js 15 App Router & Server Components.",
    icon: Sparkles,
  },
  {
    title: "Backend API & Database Engineering",
    desc: "Design MySQL relational databases and REST APIs in Node.js/Express or PHP.",
    icon: Database,
  },
  {
    title: "Integrated AI Coding & Tooling",
    desc: "Leverage ChatGPT, V0.dev & Copilot for rapid development & debugging.",
    icon: Bot,
  },
  {
    title: "LAN Networking & Router Setup",
    desc: "Crimp RJ45 Ethernet cables, configure Wi-Fi routers & IP addressing.",
    icon: Wifi,
  },
  {
    title: "Real-World IT Problem Solving",
    desc: "Apply hands-on techniques to repair systems and build client-ready web apps.",
    icon: Wrench,
  },
]

const SKILLS = [
  "Assemble PCs and diagnose physical hardware faults",
  "Perform clean Windows OS installations and driver setups",
  "Master document formatting in Word & Pivot Tables in Excel",
  "Build responsive websites with HTML5, CSS3, Tailwind & JavaScript",
  "Develop web applications using React 19 & Next.js 15",
  "Architect backend REST APIs in Node.js/Express or PHP with MySQL",
  "Utilize AI tools (ChatGPT, V0, Copilot) for code generation & debugging",
  "Crimp network cables and configure LAN routers & Wi-Fi networks",
  "Deploy web apps to production servers with custom domains & SSL",
  "Troubleshoot complex IT hardware, software & database issues",
]

export function ProgramOutcomes() {
  return (
    <section className="px-4 py-20 bg-accent/5">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Subsection 1: What This Program Is About */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Academy Is About</h2>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Gh0sT Tech Academy provides 100% practical, career-oriented training across three core tech pillars: 
              <span className="text-emerald-400 font-semibold"> Computer Systems Engineering</span>, 
              <span className="text-cyan-400 font-semibold"> Office Productivity</span>, and 
              <span className="text-purple-400 font-semibold"> Full-Stack Web Development & AI Tools</span>. 
              Our hands-on approach ensures you build real, job-ready capabilities.
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
            <p className="text-primary font-medium text-lg">After completing your training track, you will be able to:</p>
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
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-foreground/80 font-medium text-sm sm:text-base">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
