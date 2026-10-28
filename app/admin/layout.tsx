import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"

export const metadata = {
  title: "Admin Portal - Gh0sT Tech",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthed = await isAdminAuthenticated()

  // Server-side guard: stop unauthorized visitors before any admin HTML or JS bundle is sent
  if (!isAuthed) {
    redirect("/gh0st-secure-access")
  }

  return <>{children}</>
}
