"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const MODULES = [
  {
    id: "windows-installation",
    title: "Windows Installation",
    points: [
      "Clean and upgrade installations of Windows 10/11",
      "Bootable USB creation and BIOS/UEFI configuration",
      "Post-installation optimisation and first-time setup",
    ],
  },
  {
    id: "disk-partitioning",
    title: "Disk Partitioning",
    points: [
      "Understanding HDDs, SSDs and partitions",
      "Creating and resizing partitions safely",
      "Dual-boot and recovery partition strategies",
    ],
  },
  {
    id: "office-installation",
    title: "Office Installation & Activation",
    points: [
      "Installing Microsoft Office for real-world usage",
      "Best practices for activation and licensing",
      "Productivity workflows for students and offices",
    ],
  },
  {
    id: "drivers-updates",
    title: "Driver Updates",
    points: [
      "Identifying missing and outdated drivers",
      "Using vendor tools vs. Windows Update",
      "Troubleshooting blue screens and device issues",
    ],
  },
  {
    id: "virus-recovery",
    title: "Virus Removal & Recovery",
    points: [
      "Detecting malware, spyware and ransomware",
      "Using multiple antivirus tools and safe modes",
      "Data backup, cleaning and full system recovery",
    ],
  },
  {
    id: "troubleshooting-maintenance",
    title: "Troubleshooting & Maintenance",
    points: [
      "Step-by-step diagnostic approach for common issues",
      "Preventive maintenance routines for clients",
      "Documentation, customer communication and professionalism",
    ],
  },
]

export function CurriculumSection() {
  return (
    <section id="curriculum" className="py-24 px-4 bg-linear-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
            <p className="text-xs font-semibold text-accent tracking-wide">Curriculum Preview</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What You&apos;ll Learn</h2>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            Click any module below to see exactly what we cover in that area. All modules are delivered with live,
            practical demonstrations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm shadow-[0_0_40px_rgba(15,23,42,0.55)]"
        >
          <Accordion type="single" collapsible defaultValue={MODULES[0]?.id}>
            {MODULES.map((module) => (
              <AccordionItem key={module.id} value={module.id} className="px-4 md:px-6">
                <AccordionTrigger className="text-sm md:text-base">
                  <span className="font-semibold">{module.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm text-foreground/75">
                    {module.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

