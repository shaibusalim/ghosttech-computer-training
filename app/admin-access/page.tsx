import { redirect } from 'next/navigation'

export default function AdminAccessPage() {
  // This page immediately redirects to the admin login
  // The URL /admin-access serves as a hidden entry point
  redirect('/admin/login')
}
