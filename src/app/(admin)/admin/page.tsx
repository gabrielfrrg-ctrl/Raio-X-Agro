import { createAdminClient } from '@/lib/supabase/admin'
import AdminLista from '@/components/admin/AdminLista'

export default async function AdminPage() {
  const supabase = createAdminClient()

  // Busca diagnósticos com leads para calcular nível de engajamento
  const { data: diagnosticos } = await supabase
    .from('diagnostics')
    .select('id, created_at, subsetor, estado, faturamento_rs, urgencia, status, leads(id, whatsapp)')
    .order('created_at', { ascending: false })

  return <AdminLista diagnosticos={diagnosticos || []} />
}
