import Link from 'next/link'

const BULLETS = [
  {
    icon: 'ti-topology-star',
    html: '<strong>Identifica o elo da cadeia</strong> que está gerando a pressão financeira — não o sintoma, a causa',
  },
  {
    icon: 'ti-arrows-exchange',
    html: '<strong>Mapeia instrumentos financeiros</strong> com custo menor ou prazo melhor do que você paga hoje',
  },
  {
    icon: 'ti-receipt-tax',
    html: '<strong>Aponta oportunidades tributárias</strong> específicas para o seu setor — que contador generalista não mapeia',
  },
  {
    icon: 'ti-chart-bar',
    html: '<strong>Entrega seu índice de saúde financeira</strong> com o contexto do seu setor — não um número sem referência',
  },
]

const CASES = [
  {
    tag: 'REVENDA DE INSUMOS',
    texto:
      'Você financia o produtor com insumo e aceita soja como pagamento. Mas quando vai ao banco, não usa essa mesma carteira como garantia. O colateral já está no seu balanço — o banco é que não te contou que dá para usar.',
  },
  {
    tag: 'PRODUTOR DE GRÃOS',
    texto:
      'Dois produtores. Mesma lavoura, mesmo custo, mesma região. Um vendeu na colheita. O outro travou o preço antes de plantar. Na hora de pagar o arrendamento, a diferença apareceu. Não foi a chuva. Foi quando cada um decidiu vender.',
  },
  {
    tag: 'MULTIPLICADORA DE SEMENTES',
    texto:
      'Semente que não vende na safra não guarda para a próxima. Vira grão — e o que valia R$220 sai por R$130. A decisão de quando liquidar o estoque define a margem mais do que qualquer outra coisa. A maioria descobre isso tarde demais.',
  },
]

const INDICE_LINHAS = [
  { cor: '#22C55E', nome: 'Operação sólida', desc: 'Há oportunidades a capturar' },
  { cor: '#F59E0B', nome: 'Atenção identificada', desc: 'Análise recomendada antes do próximo ciclo' },
  { cor: '#EF4444', nome: 'Ação necessária', desc: 'Risco real no curto prazo' },
]

const btn: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: '#1B3A2D',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  height: '52px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
  lineHeight: '52px',
  textAlign: 'center',
}

const divider = (
  <div style={{ borderTop: '0.5px solid #D1C9B8', margin: '0 24px' }} />
)

export default function LandingPage() {
  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 40 }}>

        {/* HEADER */}
        <div style={{ padding: '32px 24px 20px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#1B3A2D', letterSpacing: '-0.5px', margin: 0 }}>
            Raio X Agro
          </h1>
          <p style={{ fontSize: 11, color: '#8B6914', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 3, marginBottom: 0 }}>
            Diagnóstico Financeiro
          </p>
        </div>

        {/* HERO */}
        <div style={{ padding: '0 24px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{
              fontSize: 11, color: '#8B6914', letterSpacing: '1.5px',
              textTransform: 'uppercase', border: '0.5px solid #8B6914',
              borderRadius: 4, padding: '4px 10px', display: 'inline-block',
            }}>
              Gratuito · 3 minutos
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Georgia, serif', fontSize: 27, color: '#1B3A2D',
            lineHeight: 1.2, margin: '0 0 14px', textAlign: 'center',
          }}>
            O que o seu gerente de banco não sabe — ou não te conta.
          </h2>

          <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.6, textAlign: 'center', marginBottom: 22 }}>
            Diagnóstico financeiro da sua operação. Sem conflito de interesse. Sem compromisso.
          </p>

          <Link href="/diagnostico/novo" style={btn}>
            Descobrir o que estou deixando na mesa
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 12 }}>
            <i className="ti ti-lock" style={{ fontSize: 13, color: '#9CA3AF' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Suas informações são confidenciais</span>
          </div>
        </div>

        {divider}

        {/* O QUE VOCÊ RECEBE */}
        <div style={{ padding: '28px 24px' }}>
          <p style={{ fontSize: 11, color: '#8B6914', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            O que você recebe
          </p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 19, color: '#1B3A2D', lineHeight: 1.3, margin: '0 0 10px' }}>
            Inteligência financeira do agro. Não uma planilha genérica.
          </h3>
          <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 22 }}>
            Calibrado com casos reais, balanços reais e dados de mercado atuais — não com fórmulas genéricas de consultoria.
          </p>

          {/* Stats grid 2x2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { num: '170+', desc: 'casos reais calibrados em 16 setores do agronegócio' },
              { num: '16', desc: 'setores mapeados — de produtor a cooperativa, trading e frigorífico' },
              { num: '5', desc: 'rodadas de validação por setor com personas de banco e agro' },
              { num: '0', desc: 'conflito de interesse — nenhum produto financeiro para vender' },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#fff', border: '0.5px solid #D1C9B8', borderRadius: 10,
                padding: '14px 12px',
              }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#1B3A2D', margin: '0 0 4px', lineHeight: 1 }}>
                  {s.num}
                </p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BULLETS.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, background: '#1B3A2D', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <i className={`ti ${b.icon}`} style={{ fontSize: 15, color: '#fff' }} />
                </div>
                <p
                  style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.55, margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: b.html }}
                />
              </div>
            ))}
          </div>
        </div>

        {divider}

        {/* O QUE OS MELHORES FAZEM */}
        <div style={{ padding: '28px 24px' }}>
          <p style={{ fontSize: 11, color: '#8B6914', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            O que os melhores fazem de diferente
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CASES.map((c, i) => (
              <div key={i} style={{
                background: '#fff', border: '0.5px solid #D1C9B8', borderRadius: 10, padding: 16,
              }}>
                <p style={{ fontSize: 10, color: '#8B6914', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                  {c.tag}
                </p>
                <p style={{ fontSize: 14, color: '#1A1A1A', lineHeight: 1.6, margin: 0 }}>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {divider}

        {/* ÍNDICE DE SAÚDE */}
        <div style={{ padding: '28px 24px' }}>
          <p style={{ fontSize: 11, color: '#8B6914', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
            Índice de saúde financeira
          </p>

          <div style={{ background: '#fff', border: '0.5px solid #D1C9B8', borderRadius: 10, padding: 20 }}>
            <p style={{
              fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.2px',
              marginBottom: 16,
            }}>
              Ao final do diagnóstico, você recebe
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {INDICE_LINHAS.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: l.cor, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A', margin: 0 }}>{l.nome}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCO ESCURO */}
        <div style={{
          background: '#1B3A2D', borderRadius: 10, padding: 20,
          margin: '0 24px 28px',
        }}>
          <h3 style={{
            fontFamily: 'Georgia, serif', fontSize: 19, color: '#F7F5F0',
            lineHeight: 1.3, margin: '0 0 10px',
          }}>
            Um nível de análise que gerente de banco não faz.
          </h3>
          <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>
            Contador não enxerga. Consultor genérico não conhece o setor. Sem conflito de interesse, sem produto para vender.
          </p>
        </div>

        {/* CTA SECUNDÁRIO */}
        <div style={{ padding: '0 24px 28px' }}>
          <Link href="/diagnostico/novo" style={btn}>
            Ver meu índice de saúde financeira
          </Link>
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: '0.5px solid #D1C9B8', padding: 20,
          textAlign: 'center', fontSize: 11, color: '#9CA3AF', lineHeight: 1.8,
        }}>
          Raio X Agro · Diagnóstico Financeiro para o Agronegócio
          <br />Gratuito · Confidencial · Sem compromisso
        </div>

      </div>
    </div>
  )
}
