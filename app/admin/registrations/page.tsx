"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getClientDb } from "@/lib/firebase/client"
import { deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Registration = {
  id: string
  full_name: string
  email: string
  phone_number: string
  whatsapp_number: string
  location: string
  course_selection: string
  previous_knowledge: boolean
  created_at?: number
}

export default function RegistrationsPage() {
  const db = getClientDb()
  const { toast } = useToast()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch {
      // Even if logout fails, redirect to login
      router.push("/admin/login")
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/registrations", { cache: "no-store" })
        if (res.status === 401) {
          // Not authenticated, redirect to login
          window.location.href = "/admin/login"
          return
        }
        const json = await res.json()
        const items: Registration[] = (json.registrations ?? []).map((data: any) => ({
          id: data.id,
          full_name: data.full_name ?? "",
          email: data.email ?? "",
          phone_number: data.phone_number ?? "",
          whatsapp_number: data.whatsapp_number ?? "",
          location: data.location ?? "",
          course_selection: data.course_selection ?? "",
          previous_knowledge: Boolean(data.previous_knowledge),
          created_at: data.created_at ?? null,
        }))
        setRegistrations(items)
      } catch {
        toast({ title: "Error", description: "Failed to load registrations", variant: "destructive" })
      }
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const res = await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (res.status === 401) {
        // Not authenticated, redirect to login
        window.location.href = "/admin/login"
        return
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete")
      }

      const next = registrations.filter((r) => r.id !== id)
      setRegistrations(next)
      toast({ title: "Deleted", description: "Registration removed successfully" })
    } catch (e) {
      console.error("Delete error:", e)
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete registration",
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="border-primary/20 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl">Registrations</CardTitle>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Prev. Knowledge</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.full_name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell className="capitalize">{r.course_selection}</TableCell>
                    <TableCell>{r.phone_number}</TableCell>
                    <TableCell>{r.whatsapp_number}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell>{r.previous_knowledge ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? "Deleting..." : "Delete"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {registrations.length === 0 && (
                  <TableRow>
                    <TableCell className="text-center text-foreground/60" colSpan={8}>
                      No registrations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
