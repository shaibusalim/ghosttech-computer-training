"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Cpu, FileText, Code2, CheckCircle2, Bot, Sparkles } from "lucide-react"
import { COURSES_CATALOG, ALL_COURSES } from "@/lib/courses-data"

export function CurriculumSection() {
  const [activeCourseId, setActiveCourseId] = useState<string>("web-dev-frontend-beginner")
  const activeCourse = COURSES_CATALOG[activeCourseId] || COURSES_CATALOG["web-dev-frontend-beginner"]

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
              Detailed Module & Syllabus Breakdown
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What You’ll Learn
          </h2>

          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Select a program below to inspect week-by-week practical modules, core technologies, and integrated AI lab tools.
          </p>

          {/* Course Switcher Tabs */}
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-card/80 backdrop-blur-md rounded-2xl border border-border/60 max-w-4xl mx-auto">
            {ALL_COURSES.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setActiveCourseId(course.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  activeCourseId === course.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {course.category === "Hardware" && <Cpu className="w-4 h-4 text-emerald-400" />}
                {course.category === "Productivity" && <FileText className="w-4 h-4 text-cyan-400" />}
                {course.category === "Software" && <Code2 className="w-4 h-4 text-purple-400" />}
                <span>{course.title.split("&")[0].trim()}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Selected Course Header Banner */}
        <motion.div
          key={activeCourse.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-card/90 via-card/60 to-card/40 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${activeCourse.badgeClass}`}>
                {activeCourse.category} Track
              </span>
              {activeCourse.hasAiIncluded && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-purple-400" /> AI Tooling Included
                </span>
              )}
              <span className="text-xs text-muted-foreground">• {activeCourse.duration} Program</span>
            </div>
            <h3 className="text-2xl font-bold">{activeCourse.title}</h3>
            <p className="text-sm text-foreground/70 mt-1">{activeCourse.subtitle}</p>
          </div>
          <div className="text-right shrink-0 bg-muted/30 p-4 rounded-xl border border-border/50">
            <span className="text-xs text-muted-foreground block">Tuition Fee</span>
            <span className="text-2xl font-bold text-primary">GHS {activeCourse.totalFee}</span>
            <span className="text-xs text-muted-foreground block font-medium">Seat Deposit: GHS {activeCourse.requiredDeposit}</span>
          </div>
        </motion.div>

        {/* Curriculum Modules Accordion */}
        <motion.div
          key={`accordion-${activeCourse.id}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm shadow-xl overflow-hidden"
        >
          <Accordion type="single" collapsible defaultValue={activeCourse.syllabus[0]?.week}>
            {activeCourse.syllabus.map((module) => (
              <AccordionItem
                key={module.week}
                value={module.week}
                className="px-4 md:px-6"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex items-center justify-center h-8 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {module.week}
                    </div>
                    <span className="font-semibold text-base md:text-lg text-foreground">
                      {module.title}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="pb-4 pt-1 px-2 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topics & Practical Lab Exercises:</p>
                    <ul className="space-y-2.5">
                      {module.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}