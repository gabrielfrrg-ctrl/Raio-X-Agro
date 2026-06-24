export default function PrivacidadePage() {
  const secoes = [
    {
      titulo: 'Quais dados coletamos',
      texto:
        'O Raio X Agro coleta as informações fornecidas voluntariamente durante o diagnóstico: nome, email, telefone, setor, estado, dados financeiros e arquivos de balanço enviados opcionalmente.',
    },
    {
      titulo: 'Como usamos os dados',
      texto:
        'As informações são utilizadas para gerar o diagnóstico financeiro e, mediante consentimento, para contato por consultores parceiros credenciados pelo Raio X Agro.',
    },
    {
      titulo: 'Com quem compartilhamos',
      texto:
        'Dados de usuários que consentiram podem ser compartilhados com consultores parceiros credenciados. Não vendemos ou compartilhamos dados com terceiros não credenciados.',
    },
    {
      titulo: 'Seus direitos (LGPD)',
      texto:
        'Conforme a Lei 13.709/2018, você tem direito a acessar, corrigir ou solicitar exclusão dos seus dados, e revogar o consentimento a qualquer momento. Contato: contato@raioxagro.com.br',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F5F0',
        color: '#1A1A1A',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            color: '#1B3A2D',
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          Política de Privacidade
        </h1>

        <p
          style={{
            fontSize: 13,
            color: '#8B6914',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 24,
          }}
        >
          Raio X Agro · Atualizado em Junho de 2026
        </p>

        <hr style={{ border: 'none', borderTop: '0.5px solid #D1C9B8', marginBottom: 32 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {secoes.map((s) => (
            <div key={s.titulo}>
              <h2
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 18,
                  color: '#1B3A2D',
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {s.titulo}
              </h2>
              <p style={{ lineHeight: 1.7, color: '#3D3D3D', fontSize: 15 }}>{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
