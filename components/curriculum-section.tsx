"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  HardDrive,
  Cpu,
  ShieldCheck,
  Wrench,
  Wifi,
  Download,
  Monitor,
  Settings,
} from "lucide-react"

const MODULES = [
  {
    id: "computer-hardware",
    title: "Computer Hardware Fundamentals",
     icon: Cpu,
    points: [
      "Understanding core components: CPU, RAM, motherboard, storage, PSU",
      "Identifying faulty hardware and replacing components safely",
      "Laptop vs desktop hardware differences and repair considerations",
      "Using diagnostic tools to test hardware performance",
    ],
  },
  {
    id: "windows-installation",
    title: "Windows Installation & Setup",
     icon: Monitor,
    points: [
      "Clean installation of Windows 10/11 from scratch",
      "Creating bootable USB drives and configuring BIOS/UEFI",
      "System setup, user accounts, updates and security configuration",
      "Optimising Windows for performance and stability",
    ],
  },
  {
    id: "disk-partitioning",
    title: "Disk Partitioning & Storage Management",
    icon: HardDrive,
    points: [
      "Understanding partitions, file systems and storage types",
      "Creating, resizing and formatting partitions safely",
      "Managing SSDs vs HDDs and improving disk performance",
      "Backup strategies before major disk operations",
    ],
  },
  {
    id: "software-installation",
    title: "Software Installation & System Setup",
    icon: Download,
    points: [
      "Installing essential software for offices and businesses",
      "Installing and activating Microsoft Office",
      "Setting up browsers, utilities and productivity tools",
      "Managing software updates and compatibility issues",
    ],
  },
  {
    id: "drivers-updates",
    title: "Driver Installation & Device Configuration",
    icon: Settings,
    points: [
      "Identifying missing or outdated drivers",
      "Installing motherboard, graphics and network drivers",
      "Using manufacturer tools vs Windows Update",
      "Fixing device manager errors and hardware conflicts",
    ],
  },
  {
    id: "virus-recovery",
    title: "Virus Removal & Data Recovery",
     icon: ShieldCheck,
    points: [
      "Detecting malware, spyware and ransomware infections",
      "Using antivirus tools and safe-mode scanning",
      "Cleaning infected systems without losing important data",
      "Basic data recovery techniques and backup strategies",
    ],
  },
  {
    id: "networking-basics",
    title: "Networking & Internet Troubleshooting",
    icon: Wifi,
    points: [
      "Understanding IP addresses, routers and local networks",
      "Setting up wired and wireless connections",
      "Troubleshooting internet connectivity problems",
      "Sharing files and printers across a network",
    ],
  },
  {
    id: "troubleshooting-maintenance",
    title: "Advanced Troubleshooting & Maintenance",
       icon: Wrench,
    points: [
      "Diagnosing slow computers and performance problems",
      "Fixing boot failures and system crashes",
      "Preventive maintenance and system optimisation",
      "Professional workflow for handling repair clients",
    ],
  },
]


export function CurriculumSection() {
  return (
    <section
      id="curriculum"
      className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
            <p className="text-xs font-semibold text-accent tracking-wide">
              Curriculum Preview
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What You’ll Learn
          </h2>

          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto">
            This training focuses on practical real-world computer repair,
            troubleshooting and system maintenance skills you can use for
            work, freelancing or starting your own tech service business.
          </p>
        </motion.div>

        {/* Curriculum Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm shadow-xl"
        >
          <Accordion type="single" collapsible defaultValue={MODULES[0]?.id}>
            {MODULES.map((module, index) => {
              const Icon = module.icon

              return (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="px-4 md:px-6"
                >
                  <AccordionTrigger className="py-5 hover:no-underline">
                    <div className="flex items-center gap-4 text-left">

                      {/* Module Number */}
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </div>

                      {/* Icon */}
                      <Icon className="h-5 w-5 text-primary" />

                      {/* Title */}
                      <span className="font-semibold text-sm md:text-base">
                        {module.title}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <ul className="space-y-3 text-sm text-foreground/75 pt-2">
                      {module.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}