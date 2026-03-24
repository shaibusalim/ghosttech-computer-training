"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    whatsapp_number: "",
    email: "",
    location: "",
    previous_knowledge: "",
    education_level: "",
    experience_level: "",
    motivation: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when value changes
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev
        return rest
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (step < 3) {
        handleNext()
      } else if (formData.termsAccepted) {
        // Only submit via Enter on Step 3 if terms are already accepted
        // to avoid accidental error toast
        handleFormSubmit()
      }
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, previous_knowledge: value }))
    // Clear error when value changes
    if (errors.previous_knowledge) {
      setErrors((prev) => {
        const { previous_knowledge, ...rest } = prev
        return rest
      })
    }
  }

  const validateStep = (currentStep: 1 | 2 | 3) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.full_name) newErrors.full_name = "Full name is required"
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email"
      if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number))
        newErrors.phone_number = "Enter a valid 10-digit phone number"
      if (!formData.whatsapp_number || !/^\d{10}$/.test(formData.whatsapp_number))
        newErrors.whatsapp_number = "Enter a valid WhatsApp number"
      if (!formData.location) newErrors.location = "Location is required"
    }

    if (currentStep === 2) {
      if (!formData.previous_knowledge) newErrors.previous_knowledge = "Please indicate previous knowledge"
      if (!formData.education_level) newErrors.education_level = "Education level is required"
      if (!formData.experience_level) newErrors.experience_level = "Experience level is required"
      if (!formData.motivation) newErrors.motivation = "Tell us why you want to join"
    }

    if (currentStep === 3) {
      if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the program terms to continue"
    }

    setErrors(newErrors)
    const errorKeys = Object.keys(newErrors)
    return {
      isValid: errorKeys.length === 0,
      firstError: errorKeys.length > 0 ? newErrors[errorKeys[0]] : null,
    }
  }

  const handleNext = () => {
    const { isValid, firstError } = validateStep(step)
    if (isValid) {
      const nextStep = step === 3 ? step : ((step + 1) as 1 | 2 | 3)
      setErrors({})
      setStep(nextStep)
    } else {
      toast({
        title: "Required Information",
        description: firstError || "Please complete all required fields",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    setErrors({})
    setStep((prev) => (prev === 1 ? prev : ((prev - 1) as 1 | 2 | 3)))
  }

  const [isSuccess, setIsSuccess] = useState(false)

  const handleFormSubmit = async () => {
    if (step < 3) {
      handleNext()
      return
    }

    const { isValid, firstError } = validateStep(3)
    if (!isValid) {
      toast({
        title: "Agreement Required",
        description: firstError || "You must accept the terms to continue",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const registrationData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        location: formData.location,
        course_selection: "All Courses",
        previous_knowledge: formData.previous_knowledge === "yes",
        education_level: formData.education_level,
        experience_level: formData.experience_level,
        motivation: formData.motivation,
      }

      const resp = await fetch("/api/registrations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })
      const json = await resp.json()
      if (!resp.ok) {
        throw new Error(json.error || "Failed to submit")
      }
      const docId = json.id

      try {
        const emailResponse = await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            full_name: formData.full_name,
            course_selection: "All Courses",
            phone_number: formData.phone_number,
            whatsapp_number: formData.whatsapp_number,
            location: formData.location,
          }),
        })

        if (!emailResponse.ok) {
          console.error("[v0] Email send failed, but registration was successful")
        }
      } catch (emailError) {
        console.error("[v0] Email error (registration still completed):", emailError)
      }

      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        setStep(1)
        setFormData({
          full_name: "",
          phone_number: "",
          whatsapp_number: "",
          email: "",
          location: "",
          previous_knowledge: "",
          education_level: "",
          experience_level: "",
          motivation: "",
          termsAccepted: false,
        })
      }, 15000)
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 bg-background rounded-lg shadow-lg"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-muted-foreground">Thank you for registering. You will receive an email confirmation shortly.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="border-primary/20 bg-linear-to-br from-card/50 to-card/20 backdrop-blur-sm max-w-2xl mx-auto">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CardTitle className="text-3xl">Ready to Start Learning?</CardTitle>
            <CardDescription className="text-base">
              Gh0sTTech Practical IT & System Engineering Program — Total course fee is GHS 700.
              A non-refundable registration deposit of <span className="font-bold text-primary">GHS 300</span> is required to secure your seat.
              The balance of GHS 400 is payable before the first session starts.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown} className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Step {step} of 3</span>
              <span>
                {step === 1 && "Personal information"}
                {step === 2 && "Background & goals"}
                {step === 3 && "Program agreement"}
              </span>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="0551234567"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.phone_number && <p className="text-xs text-destructive mt-1">{errors.phone_number}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleInputChange}
                      placeholder="0249876543"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.whatsapp_number && (
                      <p className="text-xs text-destructive mt-1">{errors.whatsapp_number}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Your residential location"
                    className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                  />
                  {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Previous Computer Knowledge</Label>
                  <RadioGroup value={formData.previous_knowledge} onValueChange={handleRadioChange} className="grid grid-cols-2 gap-4">
                    <Label
                      htmlFor="knowledge-yes"
                      className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                        formData.previous_knowledge === "yes" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value="yes" id="knowledge-yes" className="sr-only" />
                      <span className="text-lg font-semibold">Yes</span>
                      <span className="text-sm text-muted-foreground">I have computer experience</span>
                    </Label>
                    <Label
                      htmlFor="knowledge-no"
                      className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${
                        formData.previous_knowledge === "no" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value="no" id="knowledge-no" className="sr-only" />
                      <span className="text-lg font-semibold">No</span>
                      <span className="text-sm text-muted-foreground">I'm a complete beginner</span>
                    </Label>
                  </RadioGroup>
                  {errors.previous_knowledge && (
                    <p className="text-xs text-destructive mt-1">{errors.previous_knowledge}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="education_level">Education Level</Label>
                    <Input
                      id="education_level"
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleInputChange}
                      placeholder="e.g. SHS Graduate, University Student"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.education_level && (
                      <p className="text-xs text-destructive mt-1">{errors.education_level}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <Input
                      id="experience_level"
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      placeholder="e.g. Beginner, Intermediate, Some repair work"
                      className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {errors.experience_level && (
                      <p className="text-xs text-destructive mt-1">{errors.experience_level}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to join?</Label>
                  <Input
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Share your goal (job, business, skills, etc.)"
                    className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                  />
                  {errors.motivation && <p className="text-xs text-destructive mt-1">{errors.motivation}</p>}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Program Details</Label>
                  <div className="bg-input border border-border/50 rounded-md p-4 space-y-2">
                    <p className="text-sm font-medium">Gh0sTTech Practical IT &amp; System Engineering Program</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>
                        • Course fee: <span className="font-semibold">GHS 700</span>
                      </li>
                      <li>• Covers Hardware, Software &amp; Basic Networking</li>
                      <li>• Majority of sessions are hands-on practicals</li>
                    </ul>
                    <p className="text-xs text-foreground/70 mt-2">
                      After submitting this form, you&apos;ll be taken to the payment page to complete your registration.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-300 text-sm mb-1">Important</p>
                    <p className="text-sm text-foreground/80">
                      Your seat is only secured after payment is completed. You will see clear payment instructions on
                      the next page.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
                    className="h-4 w-4 rounded border-border bg-input"
                  />
                  <Label htmlFor="terms" className="text-xs text-foreground/80">
                    I understand that the program fee is GHS 700 and agree to the program terms.
                  </Label>
                </div>
                {errors.termsAccepted && <p className="text-xs text-destructive mt-1">{errors.termsAccepted}</p>}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || isSubmitting}
              >
                Back
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
