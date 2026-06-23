-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA PRINCIPAL: diagnostics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW(),

  -- Bloco 1 — Universal
  subsetor            TEXT NOT NULL,
  estado              TEXT NOT NULL,
  faturamento_rs      NUMERIC,
  trajetoria          TEXT,  -- 'cresceu' | 'estavel' | 'caiu'

  -- Bloco 2 — Resultado e dívida
  resultado           TEXT,  -- 'positivo' | 'negativo' | 'empatou'
  causa_resultado     TEXT,
  divida_total        NUMERIC,
  vencimento_12m      NUMERIC,
  caixa               NUMERIC,

  -- Bloco 3 — Campos setoriais + preocupação
  campos_setoriais    JSONB DEFAULT '{}',
  maior_preocupacao   TEXT,

  -- Metadados
  tipo_entrada        TEXT DEFAULT 'formulario',  -- 'formulario' | 'balanco'
  consentimento_lgpd  BOOLEAN DEFAULT FALSE,
  consentimento_at    TIMESTAMPTZ,
  ip_address          TEXT,

  -- Outputs de IA
  urgencia            TEXT,  -- 'alta' | 'media' | 'baixa'
  output_1            TEXT,
  output_2            TEXT,

  -- Status do atendimento
  status              TEXT DEFAULT 'aguardando',
  -- 'aguardando' | 'em_atendimento' | 'convertido' | 'descartado'
  notas_internas      TEXT
);

-- ============================================================
-- TABELA: leads (populada apenas quando lead clica no CTA)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  diagnostic_id   UUID REFERENCES public.diagnostics(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  nome            TEXT,
  whatsapp        TEXT,
  email           TEXT
);

-- ============================================================
-- TABELA: profiles (consultores com acesso ao painel)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  role        TEXT DEFAULT 'consultant',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- diagnostics: qualquer um pode inserir (formulário público)
-- leitura e atualização: somente consultores autenticados
CREATE POLICY "diagnostics_insert_public" ON public.diagnostics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "diagnostics_select_consultants" ON public.diagnostics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "diagnostics_update_consultants" ON public.diagnostics
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- leads: qualquer um pode inserir, consultores podem ler
CREATE POLICY "leads_insert_public" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "leads_select_consultants" ON public.leads
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- profiles: cada consultor vê o próprio
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id);
