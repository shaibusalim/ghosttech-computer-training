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
      } else {
        router.push("/admin/login")
      }
    } catch {
      router.push("/admin/login")
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

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" })
      router.push("/admin/login")
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

      <main className="container mx-auto px-4 py-8">
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
                          <div className="col-span-2">
                            <span className="font-medium">Payment:</span>{" "}
                            <Badge variant={reg.payment_status === "full" ? "default" : reg.payment_status === "partial" ? "outline" : "secondary"} className="ml-1">
                              {reg.payment_status ? reg.payment_status : "none"}
                            </Badge>
                            {reg.payment_status === "partial" && reg.payment_amount ? (
                              <span className="ml-2 text-muted-foreground">GHS {reg.payment_amount}</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {reg.status === "pending" && (
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
                              {reg.status === "pending" && (
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
      </main>
    </div>
  )
}
