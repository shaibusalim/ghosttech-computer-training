"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Loader2, Cpu, FileText, Code2, ShieldCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { COURSES_CATALOG, ALL_COURSES, getCourseById } from "@/lib/courses-data"

function RegistrationFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const queryCourseParam = searchParams.get("course")
  const initialCourseId = queryCourseParam && COURSES_CATALOG[queryCourseParam] ? queryCourseParam : "hardware-engineering"

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId)
  const [backendPreference, setBackendPreference] = useState<string>("nodejs")

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

  useEffect(() => {
    if (queryCourseParam && COURSES_CATALOG[queryCourseParam]) {
      setSelectedCourseId(queryCourseParam)
    }
  }, [queryCourseParam])

  const selectedCourse = getCourseById(selectedCourseId)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev
        return rest
      })
    }
  }

  const validateStep = (currentStep: 1 | 2 | 3) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!selectedCourseId) newErrors.selectedCourseId = "Please select a training program"
      if (!formData.full_name) newErrors.full_name = "Full name is required"
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address"
      if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number))
        newErrors.phone_number = "Enter a valid 10-digit phone number"
      if (!formData.whatsapp_number || !/^\d{10}$/.test(formData.whatsapp_number))
        newErrors.whatsapp_number = "Enter a valid WhatsApp number"
      if (!formData.location) newErrors.location = "Residential location is required"
    }

    if (currentStep === 2) {
      if (!formData.previous_knowledge) newErrors.previous_knowledge = "Please indicate previous computer experience"
      if (!formData.education_level) newErrors.education_level = "Education level is required"
      if (!formData.experience_level) newErrors.experience_level = "Experience level is required"
      if (!formData.motivation) newErrors.motivation = "Please state your goal or motivation"
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
      setErrors({})
      setStep((prev) => (prev === 3 ? 3 : ((prev + 1) as 1 | 2 | 3)))
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
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as 1 | 2 | 3)))
  }

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
        course_selection: selectedCourse.title,
        course_id: selectedCourse.id,
        backend_preference: selectedCourse.hasBackendOption ? (backendPreference === "nodejs" ? "Node.js/Express & MySQL" : "PHP & MySQL") : undefined,
        total_fee: selectedCourse.totalFee,
        required_deposit: selectedCourse.requiredDeposit,
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
        throw new Error(json.error || "Failed to submit registration")
      }

      const registrationId = json.id

      // Send automated student confirmation & admin notification email asynchronously
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          course_selection: selectedCourse.title,
          backend_preference: registrationData.backend_preference,
          required_deposit: selectedCourse.requiredDeposit,
          phone_number: formData.phone_number,
          whatsapp_number: formData.whatsapp_number,
          location: formData.location,
        }),
      }).catch((err) => console.error("Confirmation email background error:", err))

      // Navigate to deposit payment page
      router.push(`/register/payment?registrationId=${registrationId}`)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="border-primary/20 bg-linear-to-br from-card/60 to-card/30 backdrop-blur-md max-w-2xl mx-auto shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-semibold text-primary uppercase tracking-wider">Step {step} of 3</span>
            <span>
              {step === 1 && "Course & Contact Information"}
              {step === 2 && "Background & Goals"}
              {step === 3 && "Tuition Summary & Agreement"}
            </span>
          </div>
          <CardTitle className="text-3xl">Register for Gh0sT Tech</CardTitle>
          <CardDescription className="text-base">
            Enroll in practical hands-on IT training in Tamale, Ghana.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

            {/* STEP 1: Program Selection & Contact Info */}
            {step === 1 && (
              <div className="space-y-6">

                {/* Course Selection Cards */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Select Training Program</Label>
                  <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {ALL_COURSES.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCourseId === course.id
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border/60 bg-muted/20 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="course-radio"
                              checked={selectedCourseId === course.id}
                              onChange={() => setSelectedCourseId(course.id)}
                              className="h-4 w-4 text-primary shrink-0 mt-1"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm sm:text-base">{course.title}</p>
                                {course.hasAiIncluded && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    🤖 AI Included
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{course.duration} • {course.category} Track</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-foreground block">GHS {course.totalFee}</span>
                            <span className="text-xs text-primary font-medium">Deposit: GHS {course.requiredDeposit}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Backend Preference for Masterclass Bundle */}
                {selectedCourse.id === "web-dev-fullstack-master" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3"
                  >
                    <Label className="text-sm font-semibold text-purple-300">Masterclass Backend Language Focus</Label>
                    <RadioGroup value={backendPreference} onValueChange={setBackendPreference} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Label
                        htmlFor="backend-node"
                        className={`flex flex-col p-3 rounded-lg border cursor-pointer ${
                          backendPreference === "nodejs" ? "border-purple-500 bg-purple-500/10 font-medium" : "border-border/60 bg-card/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="nodejs" id="backend-node" />
                          <span className="text-sm font-bold">Node.js + Express & MySQL</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6 mt-1">Modern Full-Stack JavaScript</span>
                      </Label>

                      <Label
                        htmlFor="backend-php"
                        className={`flex flex-col p-3 rounded-lg border cursor-pointer ${
                          backendPreference === "php" ? "border-purple-500 bg-purple-500/10 font-medium" : "border-border/60 bg-card/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="php" id="backend-php" />
                          <span className="text-sm font-bold">PHP & MySQL</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6 mt-1">Classic Server-Side Web Dev</span>
                      </Label>
                    </RadioGroup>
                  </motion.div>
                )}


                {/* Personal Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Salim Shaibu"
                      className="bg-input"
                    />
                    {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
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
                      className="bg-input"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="0551234567"
                      className="bg-input"
                    />
                    {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      value={formData.whatsapp_number}
                      onChange={handleInputChange}
                      placeholder="0249876543"
                      className="bg-input"
                    />
                    {errors.whatsapp_number && <p className="text-xs text-destructive">{errors.whatsapp_number}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Residential Location (in Tamale)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Gurugu, Lamashegu, Kalpohin"
                    className="bg-input"
                  />
                  {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                </div>

              </div>
            )}

            {/* STEP 2: Background & Motivation */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Previous Computer Experience</Label>
                  <RadioGroup
                    value={formData.previous_knowledge}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, previous_knowledge: val }))}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="knowledge-yes"
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer ${
                        formData.previous_knowledge === "yes" ? "border-primary bg-primary/10" : "border-border/60 bg-card/40"
                      }`}
                    >
                      <RadioGroupItem value="yes" id="knowledge-yes" className="sr-only" />
                      <span className="font-bold text-base">Yes</span>
                      <span className="text-xs text-muted-foreground">I have prior experience</span>
                    </Label>

                    <Label
                      htmlFor="knowledge-no"
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer ${
                        formData.previous_knowledge === "no" ? "border-primary bg-primary/10" : "border-border/60 bg-card/40"
                      }`}
                    >
                      <RadioGroupItem value="no" id="knowledge-no" className="sr-only" />
                      <span className="font-bold text-base">No</span>
                      <span className="text-xs text-muted-foreground">I am a complete beginner</span>
                    </Label>
                  </RadioGroup>
                  {errors.previous_knowledge && <p className="text-xs text-destructive">{errors.previous_knowledge}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education_level">Education Level</Label>
                    <Input
                      id="education_level"
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleInputChange}
                      placeholder="e.g. SHS Graduate, Tertiary Student"
                      className="bg-input"
                    />
                    {errors.education_level && <p className="text-xs text-destructive">{errors.education_level}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Skill / Experience Level</Label>
                    <Input
                      id="experience_level"
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      placeholder="e.g. Beginner, Intermediate"
                      className="bg-input"
                    />
                    {errors.experience_level && <p className="text-xs text-destructive">{errors.experience_level}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to take this training?</Label>
                  <Input
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Share your goals (career, business, skill building)"
                    className="bg-input"
                  />
                  {errors.motivation && <p className="text-xs text-destructive">{errors.motivation}</p>}
                </div>
              </div>
            )}

            {/* STEP 3: Summary & Agreement */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-card border border-primary/20 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs text-primary font-semibold uppercase">Selected Course</span>
                      <h4 className="text-xl font-bold text-foreground">{selectedCourse.title}</h4>
                      <p className="text-xs text-muted-foreground">{selectedCourse.duration} Program</p>
                      {selectedCourse.hasBackendOption && (
                        <p className="text-xs text-purple-400 font-medium mt-1">
                          Backend Path: {backendPreference === "nodejs" ? "Node.js + Express & MySQL" : "PHP & MySQL"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tuition Fee:</span>
                      <span className="font-bold">GHS {selectedCourse.totalFee}.00</span>
                    </div>
                    <div className="flex justify-between text-primary font-bold">
                      <span>Required Seat Deposit:</span>
                      <span>GHS {selectedCourse.requiredDeposit}.00</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-primary/10">
                      <span>Remaining Balance (Due before start):</span>
                      <span>GHS {selectedCourse.totalFee - selectedCourse.requiredDeposit}.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80">
                    Your seat is officially secured once your deposit of <span className="font-bold text-amber-300">GHS {selectedCourse.requiredDeposit}</span> is completed on the next page via Mobile Money.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="terms" className="text-xs text-foreground/80 cursor-pointer">
                    I agree to the training terms and confirm that tuition for {selectedCourse.title} is GHS {selectedCourse.totalFee}.
                  </Label>
                </div>
                {errors.termsAccepted && <p className="text-xs text-destructive">{errors.termsAccepted}</p>}
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || isSubmitting}>
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                    </span>
                  ) : (
                    `Proceed to Pay GHS ${selectedCourse.requiredDeposit} Deposit`
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

export function RegistrationForm() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading registration form...</div>}>
      <RegistrationFormContent />
    </Suspense>
  )
}
