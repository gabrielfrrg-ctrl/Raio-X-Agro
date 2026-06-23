import { redirect } from 'next/navigation'

// O dashboard de consultores foi movido para /admin
export default function DashboardPage() {
  redirect('/admin')
}
