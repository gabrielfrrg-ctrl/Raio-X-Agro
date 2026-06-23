import { NextRequest, NextResponse } from 'next/server'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB
const TIPOS_ACEITOS = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const arquivo = formData.get('arquivo') as File | null
  if (!arquivo) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
  }

  // Validação de tipo
  const isPDF = arquivo.type === 'application/pdf' || arquivo.name.toLowerCase().endsWith('.pdf')
  const isXLSX = arquivo.name.toLowerCase().endsWith('.xlsx') || arquivo.name.toLowerCase().endsWith('.xls')
    || TIPOS_ACEITOS.slice(1).includes(arquivo.type)

  if (!isPDF && !isXLSX) {
    return NextResponse.json({ error: 'Formato não suportado. Envie um PDF ou XLSX.' }, { status: 400 })
  }

  // Validação de tamanho
  const buffer = Buffer.from(await arquivo.arrayBuffer())

  console.log('[extrair] Arquivo recebido:', {
    nome: arquivo.name,
    tipo: arquivo.type,
    tamanhoBytes: buffer.byteLength,
    isPDF,
    isXLSX,
  })

  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10MB.' }, { status: 400 })
  }

  try {
    let texto = ''

    if (isPDF) {
      console.log('[extrair] Iniciando pdf-parse...')
      // Importa do módulo interno para evitar o require do arquivo de teste do index.js
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js') as (buf: Buffer) => Promise<{ text: string; numpages: number }>
      const resultado = await pdfParse(buffer)
      console.log('[extrair] PDF lido com sucesso. Páginas:', resultado.numpages, '| Chars:', resultado.text.length)
      texto = resultado.text
    } else {
      console.log('[extrair] Iniciando xlsx...')
      const XLSX = await import('xlsx')
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      console.log('[extrair] XLSX lido. Planilhas:', workbook.SheetNames)
      const linhas: string[] = []
      for (const nomePlanilha of workbook.SheetNames) {
        const planilha = workbook.Sheets[nomePlanilha]
        const csv = XLSX.utils.sheet_to_csv(planilha)
        if (csv.trim()) linhas.push(`[${nomePlanilha}]\n${csv}`)
      }
      texto = linhas.join('\n\n')
      console.log('[extrair] XLSX chars extraídos:', texto.length)
    }

    // Limpa espaços excessivos e limita o tamanho para o prompt
    texto = texto.replace(/\s{3,}/g, '\n').trim()
    if (texto.length > 12000) {
      texto = texto.slice(0, 12000) + '\n[documento truncado para caber no diagnóstico]'
    }

    console.log('[extrair] Texto final:', texto.length, 'chars')

    if (!texto || texto.length < 50) {
      console.warn('[extrair] Texto insuficiente — retornando erro_leitura')
      return NextResponse.json({ erro_leitura: true }, { status: 200 })
    }

    return NextResponse.json({ texto })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[extrair] ERRO ao processar documento:')
    console.error('  mensagem:', msg)
    console.error('  stack:', stack)
    return NextResponse.json({ erro_leitura: true }, { status: 200 })
  }
}
