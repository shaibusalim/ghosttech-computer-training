"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Cpu, FileText, Code2, ArrowRight, ShieldCheck, Sparkles, Bot } from "lucide-react"
import { COURSES_CATALOG, Course } from "@/lib/courses-data"
import Link from "next/link"

const ICON_MAP: Record<string, any> = {
  "hardware-engineering": Cpu,
  "office-productivity": FileText,
  "web-dev-frontend-beginner": Code2,
  "web-dev-frontend-advanced": Code2,
  "web-dev-backend-php": Code2,
  "web-dev-backend-node": Code2,
  "web-dev-fullstack-master": Sparkles,
}

export function CoursesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const coursesList = Object.values(COURSES_CATALOG)

  const filteredCourses = coursesList.filter((course) => {
    if (activeCategory === "All") return true
    if (activeCategory === "Hardware") return course.category === "Hardware"
    if (activeCategory === "Productivity") return course.category === "Productivity"
    if (activeCategory === "Software") return course.category === "Software"
    return true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="courses" className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6"
          >
            <p className="text-sm font-semibold text-primary">Career Training Tracks & Specialized Programs</p>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Tech Path</h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Industry-aligned practical training programs. Every Web Development track includes dedicated <span className="text-purple-400 font-semibold">AI Tool Integration</span> for accelerated learning.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-card/80 backdrop-blur-md rounded-xl border border-border/60 max-w-2xl mx-auto mb-8">
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              All Programs ({coursesList.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("Software")}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeCategory === "Software"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Web Dev & AI ({coursesList.filter((c) => c.category === "Software").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("Hardware")}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeCategory === "Hardware"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Hardware & Systems
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("Productivity")}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeCategory === "Productivity"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Office Productivity
            </button>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full" />
        </motion.div>

        {/* Course Cards Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCourses.map((course) => {
            const IconComponent = ICON_MAP[course.id] || Cpu
            return (
              <motion.div key={course.id} variants={itemVariants} className="flex">
                <Card
                  className={`flex flex-col justify-between w-full border-primary/20 bg-card/60 backdrop-blur-md ${course.borderHoverClass} transition-all duration-300 group shadow-xl ${course.glowClass} hover:-translate-y-1.5`}
                >
                  <div>
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className={`w-12 h-12 bg-gradient-to-br ${course.accentColor} rounded-xl flex items-center justify-center text-white shadow-md`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {course.hasAiIncluded && (
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Bot className="w-3 h-3 text-purple-400" /> AI Included
                            </span>
                          )}
                          {course.badge && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${course.badgeClass}`}>
                              {course.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{course.duration} Program</span>
                          {course.subCategory && (
                            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {course.subCategory}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl font-bold mt-1 group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </CardTitle>
                      </div>

                      <CardDescription className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </CardDescription>

                      {/* Pricing Box */}
                      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">Tuition Fee:</span>
                          <span className="text-xl font-bold text-foreground">GHS {course.totalFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-primary font-medium">
                          <span>Deposit to reserve seat:</span>
                          <span>GHS {course.requiredDeposit}</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Key Skills & Modules:</p>
                      <ul className="space-y-2.5">
                        {course.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                            <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/register?course=${course.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs md:text-sm transition-all shadow-md group-hover:shadow-lg"
                    >
                      <span>Enroll in {course.title.split("&")[0]}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>All training programs include hands-on practical labs, course certificates, and direct instructor guidance.</span>
        </div>
      </div>
    </section>
  )
}
