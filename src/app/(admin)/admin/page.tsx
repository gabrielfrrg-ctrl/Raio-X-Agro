import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminLista from '@/components/admin/AdminLista'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: diagnosticos } = await adminClient
    .from('diagnostics')
    .select('id, created_at, subsetor, estado, faturamento_rs, urgencia, status')
    .order('created_at', { ascending: false })

  return <AdminLista diagnosticos={diagnosticos || []} />
}
