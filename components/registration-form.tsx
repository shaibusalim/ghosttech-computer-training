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
import { useToast } from "@/hooks/use-toast"
import { getClientDb } from "@/lib/firebase/client"
import { collection, addDoc } from "firebase/firestore"
import { CheckCircle, AlertCircle } from "lucide-react"

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    whatsapp_number: "",
    email: "",
    location: "",
    course_selection: "",
    previous_knowledge: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, course_selection: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, previous_knowledge: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (
        !formData.full_name ||
        !formData.phone_number ||
        !formData.whatsapp_number ||
        !formData.email ||
        !formData.location ||
        !formData.course_selection ||
        !formData.previous_knowledge
      ) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Insert into Firebase Firestore
      const db = getClientDb()
      const registrationData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        location: formData.location,
        course_selection: formData.course_selection,
        previous_knowledge: formData.previous_knowledge === "yes",
        status: "pending",
        created_at: new Date().toISOString(),
      }

      await addDoc(collection(db, "registrations"), registrationData)

      try {
        const emailResponse = await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            full_name: formData.full_name,
            course_selection: formData.course_selection,
          }),
        })

        if (!emailResponse.ok) {
          console.error("[v0] Email send failed, but registration was successful")
        }
      } catch (emailError) {
        console.error("[v0] Email error (registration still completed):", emailError)
      }

      setIsSuccess(true)
      toast({
        title: "Success!",
        description: "Registration submitted. Check your email for confirmation.",
      })

      // Reset form
      setTimeout(() => {
        setFormData({
          full_name: "",
          phone_number: "",
          whatsapp_number: "",
          email: "",
          location: "",
          course_selection: "",
          previous_knowledge: "",
        })
        setIsSuccess(false)
      }, 3000)
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
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="border-primary/50 bg-gradient-to-br from-primary/20 to-accent/10 max-w-md w-full">
          <CardContent className="pt-12 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-foreground/70">Thank you for registering. Please check your email for confirmation.</p>
            </div>
            <p className="text-sm text-foreground/50">
              We will contact you shortly regarding payment and class schedule.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm max-w-2xl mx-auto">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CardTitle className="text-3xl">Ready to Start Learning?</CardTitle>
            <CardDescription className="text-base">
              Register now for GHS 700. Payment is done physically after registration.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="0541120274"
                  className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleInputChange}
                  placeholder="0209832978"
                  className="bg-input border-border/50 focus:border-primary/50 transition-colors"
                />
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
            </div>

            <div className="space-y-3">
              <Label>Select a Course</Label>
              <Select value={formData.course_selection} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-input border-border/50 focus:border-primary/50 transition-colors">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Computer Hardware</SelectItem>
                  <SelectItem value="software">Software & System Management</SelectItem>
                  <SelectItem value="networking">Networking Basics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Previous Computer Knowledge</Label>
              <RadioGroup value={formData.previous_knowledge} onValueChange={handleRadioChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="knowledge-yes" />
                  <Label htmlFor="knowledge-yes" className="cursor-pointer font-normal">
                    Yes, I have computer experience
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="knowledge-no" />
                  <Label htmlFor="knowledge-no" className="cursor-pointer font-normal">
                    No, I&apos;m a complete beginner
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 text-sm mb-1">Important</p>
                <p className="text-sm text-foreground/80">
                  Course fee is GHS 700. Payment is done physically after registration. We will contact you shortly.
                </p>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
