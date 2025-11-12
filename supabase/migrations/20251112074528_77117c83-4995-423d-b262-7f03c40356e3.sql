-- Criar enum para tipos de utilizador
CREATE TYPE public.tipo_utilizador AS ENUM ('candidato', 'empregador');

-- Criar enum para tipo de entrevista
CREATE TYPE public.tipo_entrevista AS ENUM ('presencial', 'virtual');

-- Criar enum para status de entrevista
CREATE TYPE public.status_entrevista AS ENUM ('agendada', 'confirmada', 'cancelada', 'realizada');

-- Criar enum para status de pagamento
CREATE TYPE public.status_pagamento AS ENUM ('pendente', 'aprovado', 'rejeitado');

-- Criar enum para tipo de conta de candidato
CREATE TYPE public.tipo_conta_candidato AS ENUM ('basico', 'ativo', 'pro');

-- Tabela de perfis de utilizadores
CREATE TABLE public.perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_utilizador tipo_utilizador NOT NULL,
  nome_completo TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de candidatos
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  numero_candidato TEXT NOT NULL UNIQUE,
  tipo_conta tipo_conta_candidato DEFAULT 'basico',
  cv_url TEXT,
  data_expiracao_conta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(perfil_id)
);

-- Tabela de empregadores
CREATE TABLE public.empregadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  ramo_atuacao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(perfil_id)
);

-- Tabela de visualizações de perfil
CREATE TABLE public.visualizacoes_perfil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  empregador_id UUID NOT NULL REFERENCES public.empregadores(id) ON DELETE CASCADE,
  visualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(candidato_id, empregador_id)
);

-- Tabela de chats
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  empregador_id UUID NOT NULL REFERENCES public.empregadores(id) ON DELETE CASCADE,
  iniciado_por_empregador BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(candidato_id, empregador_id)
);

-- Tabela de mensagens
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  remetente_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de entrevistas
CREATE TABLE public.entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  empregador_id UUID NOT NULL REFERENCES public.empregadores(id) ON DELETE CASCADE,
  tipo tipo_entrevista NOT NULL,
  status status_entrevista DEFAULT 'agendada',
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  local_ou_link TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de comprovativos de pagamento
CREATE TABLE public.comprovativos_pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  tipo_servico TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  comprovativo_url TEXT NOT NULL,
  dados_ocr JSONB,
  status status_pagamento DEFAULT 'pendente',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visualizacoes_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprovativos_pagamento ENABLE ROW LEVEL SECURITY;

-- RLS Policies for perfis
CREATE POLICY "Utilizadores podem ver seu próprio perfil"
  ON public.perfis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem criar seu próprio perfil"
  ON public.perfis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem atualizar seu próprio perfil"
  ON public.perfis FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for candidatos
CREATE POLICY "Candidatos podem ver seu próprio perfil"
  ON public.candidatos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = candidatos.perfil_id
    AND perfis.user_id = auth.uid()
  ));

CREATE POLICY "Empregadores podem ver candidatos Pro"
  ON public.candidatos FOR SELECT
  USING (
    tipo_conta = 'pro'
    AND EXISTS (
      SELECT 1 FROM public.perfis p
      JOIN public.empregadores e ON e.perfil_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Candidatos podem criar seu perfil"
  ON public.candidatos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = candidatos.perfil_id
    AND perfis.user_id = auth.uid()
  ));

CREATE POLICY "Candidatos podem atualizar seu perfil"
  ON public.candidatos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = candidatos.perfil_id
    AND perfis.user_id = auth.uid()
  ));

-- RLS Policies for empregadores
CREATE POLICY "Empregadores podem ver seu próprio perfil"
  ON public.empregadores FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = empregadores.perfil_id
    AND perfis.user_id = auth.uid()
  ));

CREATE POLICY "Empregadores podem criar seu perfil"
  ON public.empregadores FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = empregadores.perfil_id
    AND perfis.user_id = auth.uid()
  ));

-- RLS Policies for visualizacoes_perfil
CREATE POLICY "Candidatos podem ver quem visualizou seu perfil"
  ON public.visualizacoes_perfil FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidatos c
    JOIN public.perfis p ON p.id = c.perfil_id
    WHERE c.id = visualizacoes_perfil.candidato_id
    AND p.user_id = auth.uid()
  ));

CREATE POLICY "Empregadores podem registrar visualizações"
  ON public.visualizacoes_perfil FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empregadores e
    JOIN public.perfis p ON p.id = e.perfil_id
    WHERE e.id = visualizacoes_perfil.empregador_id
    AND p.user_id = auth.uid()
  ));

-- RLS Policies for chats
CREATE POLICY "Participantes podem ver seus chats"
  ON public.chats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.candidatos c
      JOIN public.perfis p ON p.id = c.perfil_id
      WHERE c.id = chats.candidato_id
      AND p.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.empregadores e
      JOIN public.perfis p ON p.id = e.perfil_id
      WHERE e.id = chats.empregador_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Apenas empregadores podem iniciar chats"
  ON public.chats FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empregadores e
    JOIN public.perfis p ON p.id = e.perfil_id
    WHERE e.id = chats.empregador_id
    AND p.user_id = auth.uid()
  ));

-- RLS Policies for mensagens
CREATE POLICY "Participantes podem ver mensagens de seus chats"
  ON public.mensagens FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chats c
    JOIN public.candidatos cand ON cand.id = c.candidato_id
    JOIN public.perfis p1 ON p1.id = cand.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p1.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.chats c
    JOIN public.empregadores emp ON emp.id = c.empregador_id
    JOIN public.perfis p2 ON p2.id = emp.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p2.user_id = auth.uid()
  ));

CREATE POLICY "Participantes podem enviar mensagens"
  ON public.mensagens FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.perfis
    WHERE perfis.id = mensagens.remetente_id
    AND perfis.user_id = auth.uid()
  ));

-- RLS Policies for entrevistas
CREATE POLICY "Participantes podem ver suas entrevistas"
  ON public.entrevistas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.candidatos c
      JOIN public.perfis p ON p.id = c.perfil_id
      WHERE c.id = entrevistas.candidato_id
      AND p.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.empregadores e
      JOIN public.perfis p ON p.id = e.perfil_id
      WHERE e.id = entrevistas.empregador_id
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Empregadores podem agendar entrevistas"
  ON public.entrevistas FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empregadores e
    JOIN public.perfis p ON p.id = e.perfil_id
    WHERE e.id = entrevistas.empregador_id
    AND p.user_id = auth.uid()
  ));

CREATE POLICY "Empregadores podem atualizar entrevistas"
  ON public.entrevistas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.empregadores e
    JOIN public.perfis p ON p.id = e.perfil_id
    WHERE e.id = entrevistas.empregador_id
    AND p.user_id = auth.uid()
  ));

-- RLS Policies for comprovativos_pagamento
CREATE POLICY "Candidatos podem ver seus comprovativos"
  ON public.comprovativos_pagamento FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidatos c
    JOIN public.perfis p ON p.id = c.perfil_id
    WHERE c.id = comprovativos_pagamento.candidato_id
    AND p.user_id = auth.uid()
  ));

CREATE POLICY "Candidatos podem criar comprovativos"
  ON public.comprovativos_pagamento FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidatos c
    JOIN public.perfis p ON p.id = c.perfil_id
    WHERE c.id = comprovativos_pagamento.candidato_id
    AND p.user_id = auth.uid()
  ));

-- Function para gerar número de candidato
CREATE OR REPLACE FUNCTION public.gerar_numero_candidato()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  numero TEXT;
  existe BOOLEAN;
BEGIN
  LOOP
    numero := 'EJ' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM candidatos WHERE numero_candidato = numero) INTO existe;
    EXIT WHEN NOT existe;
  END LOOP;
  RETURN numero;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_perfis_updated_at
  BEFORE UPDATE ON public.perfis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidatos_updated_at
  BEFORE UPDATE ON public.candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_empregadores_updated_at
  BEFORE UPDATE ON public.empregadores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entrevistas_updated_at
  BEFORE UPDATE ON public.entrevistas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comprovativos_updated_at
  BEFORE UPDATE ON public.comprovativos_pagamento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();