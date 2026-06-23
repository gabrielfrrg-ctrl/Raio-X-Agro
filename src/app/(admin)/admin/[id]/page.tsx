import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminDetalhe from '@/components/admin/AdminDetalhe'

export default async function AdminDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: diagnostic } = await adminClient
    .from('diagnostics')
    .select('*, leads(*)')
    .eq('id', id)
    .single()

  if (!diagnostic) notFound()

  return <AdminDetalhe diagnostic={diagnostic} />
}
