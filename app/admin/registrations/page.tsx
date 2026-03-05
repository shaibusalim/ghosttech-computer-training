"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LogOut, RefreshCw, Trash2, Check, CreditCard, Loader2 } from "lucide-react"
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

interface GalleryItemSummary {
  id: string
  title: string
  imageUrl: string
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
  previous_knowledge: boolean
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
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
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
        fetchGallery()
      } else {
        router.push("/gh0st-secure-access")
      }
    } catch {
      router.push("/gh0st-secure-access")
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
              <CardDescription>Pending Payments</CardDescription>
              <CardTitle className="text-2xl">{pendingPayments}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Gallery Images</CardDescription>
              <CardTitle className="text-2xl">{totalGalleryImages}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Registrations table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registrations</CardTitle>
                <CardDescription>
                  View and manage course registrations
                </CardDescription>
              </div>
              <Button onClick={fetchRegistrations} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {registrations.map((reg) => (
                    <Card key={reg.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{reg.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{reg.email}</p>
                          </div>
                          <Badge variant={reg.status === "pending" ? "outline" : "default"}>
                            {reg.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Phone:</span> {reg.phone_number}
                          </div>
                          <div>
                            <span className="font-medium">WhatsApp:</span> {reg.whatsapp_number}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Location:</span> {reg.location}
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium">Course:</span> {reg.course_selection}
                          </div>
                          <div>
                            <span className="font-medium">Knowledge:</span>
                            <Badge variant={reg.previous_knowledge ? "default" : "secondary"} className="ml-1">
                              {reg.previous_knowledge ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Registered:</span> {formatDate(reg.created_at)}
                          </div>
                          <div className="col-span-2 mt-1">
                            <span className="font-medium mr-2">Payment:</span>
                            <Badge variant={reg.payment_status === "full" ? "default" : reg.payment_status === "partial" ? "outline" : "secondary"}>
                              {reg.payment_status ? reg.payment_status : "none"}
                            </Badge>
                            {reg.payment_status === "partial" && reg.payment_amount ? (
                              <span className="ml-2 text-muted-foreground text-xs font-semibold underline underline-offset-4 decoration-primary/30">GHS {reg.payment_amount}</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {(reg.status === "pending" || reg.status === "awaiting_admin_approval") && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(reg)}
                              className="flex-1"
                              disabled={approveLoadingId === reg.id}
                            >
                              {approveLoadingId === reg.id ? (
                                <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Approving</span>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </>
                              )}
                            </Button>
                          )}
                          <Dialog open={paymentDialogOpen && selectedRegistration?.id === reg.id} onOpenChange={setPaymentDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary" className="flex-1" onClick={() => openPaymentDialog(reg)}>
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
                                    <Label htmlFor="amount">Amount (GHS)</Label>
                                    <Input
                                      id="amount"
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
                              <Button size="sm" variant="destructive" className="flex-1" disabled={deleteLoadingId === reg.id}>
                                {deleteLoadingId === reg.id ? (
                                  <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Deleting</span>
                                ) : (
                                  <>
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                  </>
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
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Knowledge</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.full_name}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.phone_number}</TableCell>
                          <TableCell>{reg.whatsapp_number}</TableCell>
                          <TableCell>{reg.location}</TableCell>
                          <TableCell>{reg.course_selection}</TableCell>
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
                              {(reg.status === "pending" || reg.status === "awaiting_admin_approval") && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(reg)}
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={approveLoadingId === reg.id}
                                >
                                  {approveLoadingId === reg.id ? (
                                    <span className="inline-flex items-center"><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Approving</span>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                              )}
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

        {/* Gallery management */}
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
                          src={item.imageUrl}
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
      </main>
    </div>
  )
}
