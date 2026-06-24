import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminDetalhe from '@/components/admin/AdminDetalhe'

export default async function AdminDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: diagnostic } = await supabase
    .from('diagnostics')
    .select('*, leads(*)')
    .eq('id', id)
    .single()

  if (!diagnostic) notFound()

  return <AdminDetalhe diagnostic={diagnostic} />
}
