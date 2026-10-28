"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  RefreshCw,
  Trash2,
  Check,
  CreditCard,
  Loader2,
  Eye,
  BookOpen,
  Plus,
  Pencil,
  Layers,
  Users,
  Sparkles,
  Cpu,
  FileText,
  Code2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Course, ALL_COURSES } from "@/lib/courses-data"

interface GalleryItemSummary {
  id: string
  title: string
  imageurl: string
  category: string
}

interface Registration {
  id: string
  full_name: string
  phone_number: string
  whatsapp_number: string
  email: string
  location: string
  course_selection: string
  course_id?: string
  backend_preference?: string
  total_fee?: number
  required_deposit?: number
  previous_knowledge: boolean
  education_level: string
  experience_level: string
  motivation: string
  status: string
  created_at: string
  payment_status?: "none" | "partial" | "full"
  payment_amount?: number
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [selectedDetails, setSelectedDetails] = useState<Registration | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"none" | "partial" | "full">("none")
  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(undefined)
  const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
  const [paymentSaving, setPaymentSaving] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItemSummary[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState<"installation" | "virus-removal" | "hardware" | "classroom">("installation")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [courseFilter, setCourseFilter] = useState<string>("all")

  // Courses Management State
  const [courses, setCourses] = useState<Course[]>(ALL_COURSES)
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [courseDialogOpen, setCourseDialogOpen] = useState(false)
  const [courseDialogMode, setCourseDialogMode] = useState<"create" | "edit">("edit")
  const [courseSaving, setCourseSaving] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string>("")
  const [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    category: "Software" as "Hardware" | "Productivity" | "Software",
    duration: "4 Weeks",
    totalFee: 700,
    requiredDeposit: 300,
    badge: "",
    highlights: "",
    hasAiIncluded: false,
    hasBackendOption: false,
    isActive: true,
  })

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/registrations", {
        credentials: "include",
      })
      if (response.ok) {
        setIsAuthenticated(true)
        fetchRegistrations()
        fetchCourses()
        fetchGallery()
      } else {
        router.push("/gh0st-secure-access")
      }
    } catch {
      router.push("/gh0st-secure-access")
    }
  }

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true)
      const res = await fetch("/api/admin/courses", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses)
        }
      }
    } catch (err) {
      console.error("Failed to load courses:", err)
    } finally {
      setCoursesLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/registrations", {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      } else {
        router.push("/gh0st-secure-access")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registrations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGallery = async () => {
    try {
      setGalleryLoading(true)
      const response = await fetch("/api/admin/gallery", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setGalleryItems((data.items || []) as GalleryItemSummary[])
        setGalleryError(null)
      } else {
        setGalleryError("Failed to load gallery")
      }
    } catch (error) {
      console.error("Failed to fetch gallery", error)
      setGalleryError("Failed to load gallery")
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" })
      router.push("/gh0st-secure-access")
    } catch {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      })
    }
  }

  const openPaymentDialog = (reg: Registration) => {
    setSelectedRegistration(reg)
    setPaymentStatus(reg.payment_status || "none")
    setPaymentAmount(reg.payment_amount)
    setPaymentDialogOpen(true)
  }

  const openDetailsDialog = (reg: Registration) => {
    setSelectedDetails(reg)
    setDetailsDialogOpen(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedRegistration) return
    try {
      const response = await fetch(`/api/admin/registrations/${selectedRegistration.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_amount: paymentStatus === "partial" ? paymentAmount : undefined,
          email: selectedRegistration.email,
          full_name: selectedRegistration.full_name,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment status updated and email sent",
        })
        setPaymentDialogOpen(false)
        setSelectedRegistration(null)
        fetchRegistrations()
      } else {
        const errorText = await response.text()
        toast({
          title: "Error",
          description: `Failed to update payment: ${errorText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = async (id: string) => {
    // Optimistically remove from UI first
    setRegistrations(prev => prev.filter(reg => reg.id !== id))

    try {
      setDeleteLoadingId(id)
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration deleted successfully",
        })
      } else {
        // Revert the optimistic update on failure
        fetchRegistrations()
        const errorText = await response.text()
        console.error("Delete failed:", response.status, errorText)
        toast({
          title: "Error",
          description: `Failed to delete registration: ${errorText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      // Revert the optimistic update on error
      fetchRegistrations()
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      })
    } finally {
      setDeleteLoadingId(null)
    }
  }

  const handleApprove = async (registration: Registration) => {
    try {
      setApproveLoadingId(registration.id)
      const response = await fetch(`/api/admin/registrations/${registration.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: registration.email,
          full_name: registration.full_name,
          course_selection: registration.course_selection,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Registration approved and email sent",
        })
        fetchRegistrations()
      } else {
        toast({
          title: "Error",
          description: "Failed to approve registration",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      })
    } finally {
      setApproveLoadingId(null)
    }
  }

  const totalRegistrations = registrations.length
  const paidRegistrations = registrations.filter(
    (r) => r.payment_status === "full" || r.payment_status === "partial",
  ).length
  const pendingPayments = registrations.filter(
    (r) => r.payment_status === "none" || !r.payment_status,
  ).length
  const totalGalleryImages = galleryItems.length

  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      toast({ title: "Error", description: "Please select an image to upload", variant: "destructive" })
      return
    }

    try {
      setUploading(true)
      const fr = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        fr.onload = () => resolve(fr.result as string)
        fr.onerror = () => reject(new Error("File read error"))
        fr.readAsDataURL(uploadFile)
      })

      const resp = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: uploadTitle || uploadFile.name,
          description: uploadDescription,
          category: uploadCategory,
          imageData: dataUrl,
        }),
      })

      if (!resp.ok) {
        const text = await resp.text()
        toast({
          title: "Upload failed",
          description: text || "Unable to upload image",
          variant: "destructive",
        })
      } else {
        toast({ title: "Image uploaded", description: "Gallery updated successfully" })
        setUploadTitle("")
        setUploadDescription("")
        setUploadFile(null)
        await fetchGallery()
      }
    } catch (err) {
      console.error("Upload error", err)
      toast({
        title: "Upload failed",
        description: "Unexpected error while uploading image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    try {
      const resp = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (resp.ok) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id))
        toast({ title: "Deleted", description: "Gallery image removed" })
      } else {
        const text = await resp.text()
        toast({ title: "Error", description: text || "Failed to delete image", variant: "destructive" })
      }
    } catch (err) {
      console.error("Delete gallery item error", err)
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  const handleOpenCreateCourse = () => {
    setCourseDialogMode("create")
    setEditingCourseId("")
    setCourseForm({
      id: "",
      title: "",
      subtitle: "",
      category: "Software",
      duration: "4 Weeks",
      totalFee: 700,
      requiredDeposit: 300,
      badge: "",
      highlights: "",
      hasAiIncluded: true,
      hasBackendOption: false,
      isActive: true,
    })
    setCourseDialogOpen(true)
  }

  const handleOpenEditCourse = (course: Course) => {
    setCourseDialogMode("edit")
    setEditingCourseId(course.id)
    setCourseForm({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle || "",
      category: course.category,
      duration: course.duration,
      totalFee: course.totalFee,
      requiredDeposit: course.requiredDeposit,
      badge: course.badge || "",
      highlights: Array.isArray(course.highlights) ? course.highlights.join("\n") : "",
      hasAiIncluded: Boolean(course.hasAiIncluded),
      hasBackendOption: Boolean(course.hasBackendOption),
      isActive: course.isActive !== false,
    })
    setCourseDialogOpen(true)
  }

  const handleToggleCourseActive = async (course: Course) => {
    const nextActive = course.isActive === false ? true : false
    // Optimistic UI update
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, isActive: nextActive } : c))
    )

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: nextActive }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        toast({
          title: "Update failed",
          description: errorData.error || "Could not update course visibility",
          variant: "destructive",
        })
        // Revert
        fetchCourses()
      } else {
        toast({
          title: nextActive ? "Registration Opened" : "Course Marked Unavailable",
          description: `${course.title} is now ${nextActive ? "open for enrollment on the website" : "marked as unavailable (registration disabled)"}.`,
        })
      }
    } catch (err) {
      toast({
        title: "Network error",
        description: "Failed to update course status",
        variant: "destructive",
      })
      fetchCourses()
    }
  }

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseForm.id || !courseForm.title) {
      toast({
        title: "Missing fields",
        description: "Course ID and Title are required",
        variant: "destructive",
      })
      return
    }

    try {
      setCourseSaving(true)
      const highlightsArray = courseForm.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter((h) => h.length > 0)

      const payload = {
        id: courseForm.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
        title: courseForm.title.trim(),
        subtitle: courseForm.subtitle.trim(),
        category: courseForm.category,
        duration: courseForm.duration.trim(),
        total_fee: Number(courseForm.totalFee),
        required_deposit: Number(courseForm.requiredDeposit),
        badge: courseForm.badge.trim() || null,
        highlights: highlightsArray,
        has_ai_included: courseForm.hasAiIncluded,
        has_backend_option: courseForm.hasBackendOption,
        is_active: courseForm.isActive,
      }

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: `Course "${payload.title}" saved successfully`,
        })
        setCourseDialogOpen(false)
        await fetchCourses()
      } else {
        const err = await res.json().catch(() => ({}))
        toast({
          title: "Save failed",
          description: err.error || "Could not save course",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An error occurred while saving the course",
        variant: "destructive",
      })
    } finally {
      setCourseSaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Registrations</CardDescription>
              <CardTitle className="text-2xl">{totalRegistrations}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paid Registrations</CardDescription>
              <CardTitle className="text-2xl">{paidRegistrations}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Courses</CardDescription>
              <CardTitle className="text-2xl">{courses.filter((c) => c.isActive !== false).length} / {courses.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Gallery Images</CardDescription>
              <CardTitle className="text-2xl">{totalGalleryImages}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="registrations" className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList className="bg-card border p-1 rounded-xl h-auto flex flex-wrap gap-1">
              <TabsTrigger
                value="registrations"
                className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground font-semibold"
              >
                <Users className="w-4 h-4" />
                Registrations
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted/60">{registrations.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground font-semibold"
              >
                <BookOpen className="w-4 h-4" />
                Course Management
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted/60">{courses.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="flex items-center gap-2 py-2 px-4 rounded-lg data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground font-semibold"
              >
                <Layers className="w-4 h-4" />
                Gallery
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted/60">{galleryItems.length}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: REGISTRATIONS */}
          <TabsContent value="registrations" className="space-y-6 m-0">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Registrations</CardTitle>
                    <CardDescription>
                      View and manage course registrations
                    </CardDescription>
                  </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium"
                >
                  <option value="all">All Courses</option>
                  <option value="hardware">Hardware Engineering</option>
                  <option value="productivity">Office Productivity</option>
                  <option value="web-dev">Web Dev & AI</option>
                </select>
                <Button onClick={fetchRegistrations} disabled={loading} size="sm">
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No registrations found</p>
              </div>
            ) : (
              <>
                {/* User Details Dialog */}
                <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                  <DialogContent className="max-w-md sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>User Details</DialogTitle>
                      <DialogDescription>
                        Full information for {selectedDetails?.full_name}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedDetails && (
                      <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Full Name</Label>
                            <p className="font-medium">{selectedDetails.full_name}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <div>
                              <Badge variant={selectedDetails.status === "pending" ? "outline" : "default"}>
                                {selectedDetails.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <p className="text-sm">{selectedDetails.email}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <p className="text-sm">{selectedDetails.phone_number}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">WhatsApp</Label>
                            <p className="text-sm">{selectedDetails.whatsapp_number}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Location</Label>
                            <p className="text-sm">{selectedDetails.location}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Course Selection</Label>
                            <p className="text-sm font-medium">{selectedDetails.course_selection}</p>
                            {selectedDetails.backend_preference && (
                              <p className="text-xs text-purple-400 font-semibold mt-0.5">
                                Backend Track: {selectedDetails.backend_preference}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Previous Knowledge</Label>
                            <p className="text-sm">{selectedDetails.previous_knowledge ? "Yes" : "No"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Education Level</Label>
                            <p className="text-sm">{selectedDetails.education_level || "N/A"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Experience Level</Label>
                            <p className="text-sm">{selectedDetails.experience_level || "N/A"}</p>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-xs text-muted-foreground">Motivation / Goals</Label>
                            <p className="text-sm italic">{selectedDetails.motivation || "No motivation provided"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Registration Date</Label>
                            <p className="text-sm">{formatDate(selectedDetails.created_at)}</p>
                          </div>
                          <div className="col-span-2 space-y-1 border-t pt-2">
                            <Label className="text-xs text-muted-foreground">Payment Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={selectedDetails.payment_status === "full" ? "default" : selectedDetails.payment_status === "partial" ? "outline" : "secondary"}>
                                {selectedDetails.payment_status ? selectedDetails.payment_status : "none"}
                              </Badge>
                              {selectedDetails.payment_status === "partial" && selectedDetails.payment_amount && (
                                <span className="text-sm font-bold">GHS {selectedDetails.payment_amount}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t mt-4">
                          <Button
                            className={cn(
                              "flex-1",
                              selectedDetails.status === "approved" ? "bg-slate-500 hover:bg-slate-600" : "bg-green-600 hover:bg-green-700"
                            )}
                            onClick={() => {
                              handleApprove(selectedDetails)
                              setDetailsDialogOpen(false)
                            }}
                            disabled={approveLoadingId === selectedDetails.id}
                          >
                            {approveLoadingId === selectedDetails.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            {selectedDetails.status === "approved" ? "Already Approved" : "Approve Student"}
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => setDetailsDialogOpen(false)}>
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Responsive Table View */}
                <div className="overflow-x-auto rounded-md border shadow-inner">
                  <Table className="min-w-[1600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Motivation</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Knowledge</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations
                        .filter((reg) => {
                          if (courseFilter === "all") return true
                          if (courseFilter === "hardware") return reg.course_id === "hardware-engineering" || reg.course_selection?.toLowerCase().includes("hardware")
                          if (courseFilter === "productivity") return reg.course_id === "office-productivity" || reg.course_selection?.toLowerCase().includes("office")
                          if (courseFilter === "web-dev") return reg.course_id === "web-dev-ai" || reg.course_selection?.toLowerCase().includes("web")
                          return true
                        })
                        .map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.full_name}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.phone_number}</TableCell>
                          <TableCell>{reg.whatsapp_number}</TableCell>
                          <TableCell>{reg.location}</TableCell>
                          <TableCell className="max-w-[150px] truncate" title={reg.education_level}>{reg.education_level || "N/A"}</TableCell>
                          <TableCell className="max-w-[150px] truncate" title={reg.experience_level}>{reg.experience_level || "N/A"}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={reg.motivation}>{reg.motivation || "N/A"}</TableCell>
                          <TableCell className="max-w-[150px] truncate" title={reg.course_selection}>{reg.course_selection}</TableCell>
                          <TableCell>
                            <Badge variant={reg.previous_knowledge ? "default" : "secondary"}>
                              {reg.previous_knowledge ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={reg.status === "pending" ? "outline" : "default"}>
                              {reg.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={reg.payment_status === "full" ? "default" : reg.payment_status === "partial" ? "outline" : "secondary"}>
                              {reg.payment_status ? reg.payment_status : "none"}
                            </Badge>
                            {reg.payment_status === "partial" && reg.payment_amount ? (
                              <span className="ml-2 text-muted-foreground">GHS {reg.payment_amount}</span>
                            ) : null}
                          </TableCell>
                          <TableCell>{formatDate(reg.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDetailsDialog(reg)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(reg)}
                                className={reg.status === "approved" ? "bg-slate-500 hover:bg-slate-600" : "bg-green-600 hover:bg-green-700"}
                                disabled={approveLoadingId === reg.id}
                              >
                                {approveLoadingId === reg.id ? (
                                  <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Processing</span>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    {reg.status === "approved" ? "Approved" : "Approve"}
                                  </>
                                )}
                              </Button>
                              <Dialog open={paymentDialogOpen && selectedRegistration?.id === reg.id} onOpenChange={setPaymentDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary" onClick={() => openPaymentDialog(reg)}>
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Confirm Payment
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Payment</DialogTitle>
                                    <DialogDescription>
                                      Set payment status for {reg.full_name}. If partial, enter the amount received.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Payment Status</Label>
                                      <div className="flex gap-2">
                                        <Button type="button" variant={paymentStatus === "full" ? "default" : "outline"} onClick={() => setPaymentStatus("full")}>
                                          Full
                                        </Button>
                                        <Button type="button" variant={paymentStatus === "partial" ? "default" : "outline"} onClick={() => setPaymentStatus("partial")}>
                                          Partial
                                        </Button>
                                        <Button type="button" variant={paymentStatus === "none" ? "default" : "outline"} onClick={() => setPaymentStatus("none")}>
                                          None
                                        </Button>
                                      </div>
                                    </div>
                                    {paymentStatus === "partial" && (
                                      <div className="space-y-2">
                                        <Label htmlFor="amount-desktop">Amount (GHS)</Label>
                                        <Input
                                          id="amount-desktop"
                                          type="number"
                                          min={1}
                                          value={paymentAmount ?? ""}
                                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                          placeholder="Enter amount received"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} disabled={paymentSaving}>Cancel</Button>
                                    <Button onClick={async () => { setPaymentSaving(true); await handleConfirmPayment(); setPaymentSaving(false) }} disabled={paymentSaving}>
                                      {paymentSaving ? (<span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving</span>) : "Save"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" disabled={deleteLoadingId === reg.id}>
                                    {deleteLoadingId === reg.id ? (
                                      <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Deleting</span>
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {reg.full_name}'s registration? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(reg.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB 2: COURSE MANAGEMENT */}
      <TabsContent value="courses" className="space-y-6 m-0">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Course Catalog & Tuition Management
                </CardTitle>
                <CardDescription>
                  Configure course titles, fees, seat deposits, duration, highlights, and active landing page visibility.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={fetchCourses} disabled={coursesLoading}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${coursesLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button size="sm" onClick={handleOpenCreateCourse}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Course
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {coursesLoading && courses.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading course catalog...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className={`border transition-all flex flex-col justify-between ${
                      course.isActive === false
                        ? "opacity-60 bg-muted/20 border-border/50"
                        : "border-border/80 shadow-xs hover:border-primary/50"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${
                              course.isActive !== false ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {course.isActive !== false ? "Open" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      {course.subtitle && (
                        <CardDescription className="line-clamp-2 text-xs">
                          {course.subtitle}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-card/60 border border-border/40 text-xs">
                        <div>
                          <p className="text-muted-foreground">Total Fee</p>
                          <p className="font-bold text-sm text-foreground">GHS {course.totalFee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Seat Deposit</p>
                          <p className="font-bold text-sm text-primary">GHS {course.requiredDeposit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium text-foreground">{course.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">AI Tools</p>
                          <p className="font-medium text-foreground">{course.hasAiIncluded ? "Yes" : "No"}</p>
                        </div>
                      </div>

                      {course.badge && (
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-medium border border-accent/30">
                          {course.badge}
                        </div>
                      )}

                      <div className="pt-2 border-t flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`toggle-${course.id}`}
                            checked={course.isActive !== false}
                            onCheckedChange={() => handleToggleCourseActive(course)}
                          />
                          <Label htmlFor={`toggle-${course.id}`} className="text-xs cursor-pointer">
                            {course.isActive !== false ? "Open for enrollment" : "Marked Unavailable"}
                          </Label>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditCourse(course)}>
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB 3: GALLERY MANAGEMENT */}
      <TabsContent value="gallery" className="space-y-6 m-0">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gallery Management</CardTitle>
                <CardDescription>Upload new training photos and manage existing gallery items.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchGallery} disabled={galleryLoading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${galleryLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUploadGallery} className="grid gap-4 md:grid-cols-[2fr,1fr] items-start">
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="gallery-title">Title</Label>
                    <Input
                      id="gallery-title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Batch 3 Windows Installation Lab"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gallery-category">Category</Label>
                    <select
                      id="gallery-category"
                      value={uploadCategory}
                      onChange={(e) =>
                        setUploadCategory(e.target.value as "installation" | "virus-removal" | "hardware" | "classroom")
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value="installation">Installation</option>
                      <option value="virus-removal">Virus Removal</option>
                      <option value="hardware">Hardware</option>
                      <option value="classroom">Classroom</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gallery-description">Description</Label>
                  <Input
                    id="gallery-description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Short caption to describe the session"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gallery-file">Image</Label>
                  <Input
                    id="gallery-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                  Upload clear photos from real training sessions. Images will appear on the public gallery page once
                  uploaded.
                </p>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
            </form>

            <div className="border-t border-border/60 pt-4">
              {galleryLoading ? (
                <p className="text-sm text-muted-foreground">Loading gallery items...</p>
              ) : galleryError ? (
                <p className="text-sm text-destructive">{galleryError}</p>
              ) : galleryItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No gallery items yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border border-border/70 bg-card text-sm"
                    >
                      <div className="h-32 w-full overflow-hidden bg-black/40">
                        {/* Use plain img to avoid layout warnings inside admin card */}
                        <img
                          src={item.imageurl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-1.5 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{item.title}</p>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {item.category}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-[11px]"
                          onClick={() => handleDeleteGalleryItem(item.id)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

        {/* COURSE EDIT / CREATE DIALOG */}
        <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {courseDialogMode === "create" ? "Add New Course Program" : `Edit Course: ${courseForm.title}`}
              </DialogTitle>
              <DialogDescription>
                Update pricing, deposit requirements, duration, badge, and live visibility on the website.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveCourse} className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cf-id">Course Identifier (Slug)</Label>
                  <Input
                    id="cf-id"
                    value={courseForm.id}
                    disabled={courseDialogMode === "edit"}
                    onChange={(e) => setCourseForm({ ...courseForm, id: e.target.value })}
                    placeholder="e.g. cloud-computing-aws"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">Unique URL key, e.g. /register?course=slug</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cf-category">Category</Label>
                  <select
                    id="cf-category"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as any })}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-medium"
                  >
                    <option value="Hardware">Hardware & Engineering</option>
                    <option value="Productivity">Office Productivity</option>
                    <option value="Software">Software Engineering / Web</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cf-title">Course Title</Label>
                <Input
                  id="cf-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Advanced Practical Computer Networking"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cf-subtitle">Subtitle / Program Summary</Label>
                <Input
                  id="cf-subtitle"
                  value={courseForm.subtitle}
                  onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                  placeholder="Key tagline displayed on catalog cards"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cf-fee">Total Fee (GHS)</Label>
                  <Input
                    id="cf-fee"
                    type="number"
                    min="0"
                    step="10"
                    value={courseForm.totalFee}
                    onChange={(e) => setCourseForm({ ...courseForm, totalFee: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cf-deposit">Required Deposit (GHS)</Label>
                  <Input
                    id="cf-deposit"
                    type="number"
                    min="0"
                    step="10"
                    value={courseForm.requiredDeposit}
                    onChange={(e) => setCourseForm({ ...courseForm, requiredDeposit: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cf-duration">Duration</Label>
                  <Input
                    id="cf-duration"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 4 Weeks"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cf-badge">Highlight Badge</Label>
                <Input
                  id="cf-badge"
                  value={courseForm.badge}
                  onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                  placeholder="e.g. Flagship Program, High Demand, Most Popular"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cf-highlights">Key Highlights & Takeaways (One per line)</Label>
                <Textarea
                  id="cf-highlights"
                  rows={4}
                  value={courseForm.highlights}
                  onChange={(e) => setCourseForm({ ...courseForm, highlights: e.target.value })}
                  placeholder="Enter each bullet point on a new line..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-xl border border-border/50">
                <div className="flex items-center gap-2">
                  <Switch
                    id="cf-active"
                    checked={courseForm.isActive}
                    onCheckedChange={(checked) => setCourseForm({ ...courseForm, isActive: checked })}
                  />
                  <Label htmlFor="cf-active" className="text-xs cursor-pointer">
                    Open for Registration
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="cf-ai"
                    checked={courseForm.hasAiIncluded}
                    onCheckedChange={(checked) => setCourseForm({ ...courseForm, hasAiIncluded: checked })}
                  />
                  <Label htmlFor="cf-ai" className="text-xs cursor-pointer">
                    AI Tools Included
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="cf-backend"
                    checked={courseForm.hasBackendOption}
                    onCheckedChange={(checked) => setCourseForm({ ...courseForm, hasBackendOption: checked })}
                  />
                  <Label htmlFor="cf-backend" className="text-xs cursor-pointer">
                    Backend Track Option
                  </Label>
                </div>
              </div>

              <DialogFooter className="pt-3">
                <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={courseSaving}>
                  {courseSaving ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Save Course"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
