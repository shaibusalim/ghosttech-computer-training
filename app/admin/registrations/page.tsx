export const dynamic = "force-dynamic"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAdminDb } from "@/lib/firebase/server"

type Registration = {
  id: string
  full_name: string
  phone_number: string
  whatsapp_number: string
  email: string
  location: string
  course_selection: string
  previous_knowledge: boolean
  created_at?: Date | null
  status?: string
}

export default async function AdminRegistrations() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")
  if (!session) {
    redirect("/admin/login")
  }

  const db = getAdminDb()
  const snapshot = await db.collection("registrations").orderBy("created_at", "desc").get()
  const registrations: Registration[] = snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      full_name: data.full_name ?? "",
      phone_number: data.phone_number ?? "",
      whatsapp_number: data.whatsapp_number ?? "",
      email: data.email ?? "",
      location: data.location ?? "",
      course_selection: data.course_selection ?? "",
      previous_knowledge: !!data.previous_knowledge,
      created_at: data.created_at?.toDate?.() ?? null,
      status: data.status ?? "pending",
    }
  })

  return (
    <div className="min-h-screen px-4 py-10">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>Monitor registrations and send confirmation emails</CardDescription>
          </div>
          <div className="flex gap-4">
            <Link href="/api/admin/logout">
              <Button variant="outline">Logout</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-2">Name</th>
                  <th className="text-left py-2 pr-2">Email</th>
                  <th className="text-left py-2 pr-2">Phone</th>
                  <th className="text-left py-2 pr-2">Course</th>
                  <th className="text-left py-2 pr-2">Previous Knowledge</th>
                  <th className="text-left py-2 pr-2">Status</th>
                  <th className="text-left py-2 pr-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 pr-2">{r.full_name}</td>
                    <td className="py-2 pr-2">{r.email}</td>
                    <td className="py-2 pr-2">{r.phone_number}</td>
                    <td className="py-2 pr-2 capitalize">{r.course_selection}</td>
                    <td className="py-2 pr-2">{r.previous_knowledge ? "Yes" : "No"}</td>
                    <td className="py-2 pr-2">{r.status}</td>
                    <td className="py-2 pr-2">
                      <form action={`/api/send-confirmation`} method="POST" className="inline">
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="email" value={r.email} />
                        <input type="hidden" name="full_name" value={r.full_name} />
                        <input type="hidden" name="course_selection" value={r.course_selection} />
                        <Button type="submit" size="sm" className="mr-2">
                          Send Email
                        </Button>
                      </form>
                      <form action={`/api/admin/registrations/${r.id}`} method="POST" className="inline">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button type="submit" size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
