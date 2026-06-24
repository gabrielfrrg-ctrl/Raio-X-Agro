import { createAdminClient } from '@/lib/supabase/admin'
import AdminLista from '@/components/admin/AdminLista'

export default async function AdminPage() {
  const supabase = createAdminClient()
  const { data: diagnosticos } = await supabase
    .from('diagnostics')
    .select('id, created_at, subsetor, estado, faturamento_rs, urgencia, status')
    .order('created_at', { ascending: false })

  return <AdminLista diagnosticos={diagnosticos || []} />
}
