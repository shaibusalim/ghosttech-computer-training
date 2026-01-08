"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const courses = [
  {
    id: "hardware",
    title: "Computer Hardware",
    description: "Master the fundamentals of computer components",
    topics: [
      "Basic computer components",
      "Disassembling & assembling PCs",
      "Hardware upgrades & maintenance",
      "Troubleshooting common issues",
    ],
    icon: "⚙️",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    id: "software",
    title: "Software & System Management",
    description: "Learn essential software skills for daily computing",
    topics: [
      "Windows installation & configuration",
      "Microsoft Office suite",
      "Virus removal & security",
      "Software installation & troubleshooting",
    ],
    icon: "💻",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    id: "networking",
    title: "Networking Basics",
    description: "Understand network fundamentals and connectivity",
    topics: [
      "Network types & concepts",
      "Cabling & connectivity",
      "LAN setup & troubleshooting",
      "Basic network security",
    ],
    icon: "🌐",
    color: "from-emerald-500/20 to-emerald-500/5",
  },
]

export function CoursesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
          >
            <p className="text-sm font-semibold text-primary">Our Curriculum</p>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Courses</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            Three core areas of computer technology designed to build your expertise from beginner to advanced
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {courses.map((course) => (
            <motion.div key={course.id} variants={itemVariants}>
              <Card
                className={`h-full border-primary/20 bg-gradient-to-br ${course.color} backdrop-blur-sm hover:border-primary/50 transition-colors duration-300 group`}
              >
                <CardHeader>
                  <div className="text-6xl mb-4 w-fit">
                    {course.icon}
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{course.title}</CardTitle>
                  <CardDescription className="text-base text-foreground/70">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {course.topics.map((topic, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{topic}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
