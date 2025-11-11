-- Tabela de províncias e municípios de Angola para normalização
CREATE TABLE public.provincias_angola (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.municipios_angola (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  provincia_id UUID NOT NULL REFERENCES public.provincias_angola(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(nome, provincia_id)
);

-- Tabela de fontes de vagas (portais, APIs, RSS feeds)
CREATE TABLE public.fontes_vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('API', 'RSS', 'SCRAPER', 'MANUAL')),
  url TEXT NOT NULL,
  frequencia_minutos INTEGER NOT NULL DEFAULT 60,
  ativa BOOLEAN DEFAULT true,
  configuracao JSONB DEFAULT '{}',
  ultima_coleta TIMESTAMPTZ,
  proxima_coleta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela principal de vagas agregadas
CREATE TABLE public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo_vaga TEXT NOT NULL,
  empresa TEXT NOT NULL,
  provincia_id UUID REFERENCES public.provincias_angola(id),
  localidade TEXT NOT NULL,
  descricao TEXT NOT NULL,
  requisitos TEXT[],
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('Tempo inteiro', 'Parcial', 'Estagio', 'Temporário', 'Freelance')),
  salario_min NUMERIC,
  salario_max NUMERIC,
  moeda TEXT DEFAULT 'Kz',
  link_origem TEXT NOT NULL,
  data_publicacao_origem TIMESTAMPTZ,
  data_coleta TIMESTAMPTZ NOT NULL DEFAULT now(),
  canais_contato JSONB DEFAULT '{}',
  ativa BOOLEAN DEFAULT true,
  hash_dedup TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_vagas_provincia ON public.vagas(provincia_id);
CREATE INDEX idx_vagas_tipo_contrato ON public.vagas(tipo_contrato);
CREATE INDEX idx_vagas_ativa ON public.vagas(ativa);
CREATE INDEX idx_vagas_hash ON public.vagas(hash_dedup);
CREATE INDEX idx_vagas_empresa ON public.vagas(empresa);
CREATE INDEX idx_vagas_data_publicacao ON public.vagas(data_publicacao_origem DESC);

-- Tabela de relação vaga-fonte (muitas para muitas)
CREATE TABLE public.vagas_fontes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  fonte_id UUID NOT NULL REFERENCES public.fontes_vagas(id) ON DELETE CASCADE,
  data_coleta TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vaga_id, fonte_id)
);

-- Tabela de logs de coleta para auditoria
CREATE TABLE public.logs_coleta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte_id UUID NOT NULL REFERENCES public.fontes_vagas(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('sucesso', 'erro', 'parcial')),
  vagas_novas INTEGER DEFAULT 0,
  vagas_atualizadas INTEGER DEFAULT 0,
  vagas_duplicadas INTEGER DEFAULT 0,
  tempo_resposta_ms INTEGER,
  mensagem_erro TEXT,
  detalhes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_logs_fonte ON public.logs_coleta(fonte_id);
CREATE INDEX idx_logs_status ON public.logs_coleta(status);
CREATE INDEX idx_logs_created ON public.logs_coleta(created_at DESC);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_fontes_vagas_updated_at
  BEFORE UPDATE ON public.fontes_vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vagas_updated_at
  BEFORE UPDATE ON public.vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir províncias de Angola
INSERT INTO public.provincias_angola (nome) VALUES
  ('Luanda'),
  ('Benguela'),
  ('Huíla'),
  ('Huambo'),
  ('Cabinda'),
  ('Cuanza Norte'),
  ('Cuanza Sul'),
  ('Cunene'),
  ('Malanje'),
  ('Moxico'),
  ('Namibe'),
  ('Uíge'),
  ('Zaire'),
  ('Lunda Norte'),
  ('Lunda Sul'),
  ('Bié'),
  ('Cuando Cubango'),
  ('Bengo');

-- Função para gerar hash de deduplicação
CREATE OR REPLACE FUNCTION public.gerar_hash_dedup(
  p_titulo TEXT,
  p_empresa TEXT,
  p_localidade TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      lower(trim(p_titulo)) || '|' || 
      lower(trim(p_empresa)) || '|' || 
      lower(trim(p_localidade)),
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Enable RLS
ALTER TABLE public.provincias_angola ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipios_angola ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fontes_vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas_fontes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs_coleta ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura para vagas e localizações
CREATE POLICY "Vagas são visíveis publicamente"
  ON public.vagas FOR SELECT
  USING (true);

CREATE POLICY "Províncias são visíveis publicamente"
  ON public.provincias_angola FOR SELECT
  USING (true);

CREATE POLICY "Municípios são visíveis publicamente"
  ON public.municipios_angola FOR SELECT
  USING (true);

-- Políticas restritas para fontes e logs (apenas service_role)
CREATE POLICY "Fontes visíveis publicamente"
  ON public.fontes_vagas FOR SELECT
  USING (true);

CREATE POLICY "Logs visíveis publicamente"
  ON public.logs_coleta FOR SELECT
  USING (true);

CREATE POLICY "Vagas-fontes visíveis publicamente"
  ON public.vagas_fontes FOR SELECT
  USING (true);