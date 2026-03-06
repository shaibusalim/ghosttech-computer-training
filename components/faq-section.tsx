"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    { q: "What is the training fee?", a: "Total fee is GHS 700. Deposit GHS 300 to reserve your seat." },
    { q: "Can I pay in installments?", a: "Yes. Pay GHS 300 deposit, remaining balance before training starts." },
    { q: "What equipment do I need?", a: "Laptop or desktop, charger, notebook, and willingness to learn." },
    { q: "What is the class schedule?", a: "Classes run on scheduled days each week. Details are shared after registration." },
    { q: "Will I receive a certificate?", a: "Yes. You receive a Gh0sTTech completion certificate after the program." },
    { q: "What happens if I miss a class?", a: "You can catch up during practice sessions and guided review." },
    { q: "What is the refund or transfer policy?", a: "Deposits are non-refundable. Transfers can be arranged to the next cohort." },
  ]

  return (
    <section className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/40">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-foreground/70">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
