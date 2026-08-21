"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export function FaqSection() {
  const faqs = [
    { 
      q: "What training courses do you offer?", 
      a: "We offer specialized tracks in Practical Computer Engineering (GHS 700), Office Productivity & Digital Literacy (GHS 500), Frontend Foundations (GHS 600), Advanced React & Next.js (GHS 750), PHP & MySQL Backend (GHS 650), Advanced Node.js/Express (GHS 750), and an 8-week Full-Stack Masterclass (GHS 1,200)." 
    },
    { 
      q: "Are AI tools included in the Web Development courses?", 
      a: "Yes! Every Web Development track includes dedicated AI Tooling & Prompt Engineering (ChatGPT, V0.dev, GitHub Copilot, Bolt.new) tailored to accelerate your learning and coding workflow." 
    },
    { 
      q: "Can I pay in installments?", 
      a: "Yes! You can reserve your seat by paying the required deposit (GHS 200 - GHS 500 depending on the course). The remaining balance is payable before your first practical session." 
    },
    { 
      q: "What equipment do I need for training?", 
      a: "You will need a working laptop, charger, notebook, and a willingness to learn. For Hardware Engineering sessions, practice PCs and diagnostic tools are provided in our lab." 
    },
    { 
      q: "Will I receive an official certificate?", 
      a: "Yes! Upon successful completion of your training track and practical projects, you will receive an official Gh0sT Tech Academy completion certificate." 
    },
    { 
      q: "Where is the training venue located?", 
      a: "Our physical training facility is located in Tamale - Gurugu, Ghana. Directions and batch schedules are provided upon registration confirmation." 
    },
    { 
      q: "What is the class schedule?", 
      a: "Classes run on flexible weekday and weekend schedules. Exact batch times are sent via WhatsApp & email after your registration deposit is confirmed." 
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-foreground/70 text-sm md:text-base">
            Everything you need to know about our courses, seat deposits, AI tools, and certificates.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-border/50 rounded-xl px-4 bg-card/40 backdrop-blur-sm">
              <AccordionTrigger className="text-left font-semibold text-base py-4 hover:no-underline hover:text-primary transition-colors">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/70 pb-4 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
