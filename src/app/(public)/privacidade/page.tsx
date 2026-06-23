export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 text-sm mb-8">Revisão pendente por advogado antes do go-live.</p>

        <div className="prose prose-sm text-gray-700 space-y-4">
          <p>
            As informações coletadas nesta plataforma são utilizadas exclusivamente para gerar
            diagnósticos financeiros personalizados e para que consultores especializados possam
            entrar em contato com os interessados.
          </p>
          <p>
            Não compartilhamos, vendemos ou cedemos seus dados a terceiros.
          </p>
          <p>
            Seus dados são armazenados com segurança e criptografia. Você pode solicitar a remoção
            dos seus dados a qualquer momento através do email de contato.
          </p>
          <p className="text-gray-400 text-xs mt-8">
            Este documento será revisado por advogado especializado em LGPD antes do lançamento público.
          </p>
        </div>
      </div>
    </div>
  )
}
