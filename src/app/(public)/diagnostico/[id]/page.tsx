import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import ResultadoView from '@/components/diagnostico/ResultadoView'

export default async function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: diagnostic, error } = await supabase
    .from('diagnostics')
    .select('id, output_1, urgencia, subsetor, estado')
    .eq('id', id)
    .single()

  if (error || !diagnostic || !diagnostic.output_1) {
    notFound()
  }

  return <ResultadoView diagnostic={diagnostic} />
}
