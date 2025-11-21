-- Criar tabela de entrevistas/agendamentos
CREATE TABLE IF NOT EXISTS public.entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empregador_id UUID NOT NULL REFERENCES public.empregadores(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  vaga_id UUID,
  data_entrevista TIMESTAMP WITH TIME ZONE,
  tipo_entrevista TEXT, -- presencial, online, telefone
  local_ou_link TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'agendada', -- agendada, confirmada, realizada, cancelada
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de entrevistas
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;

-- Políticas para entrevistas
-- Empregadores podem gerenciar suas próprias entrevistas
CREATE POLICY "Empregadores podem gerenciar suas entrevistas"
ON public.entrevistas
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.empregadores e
    WHERE e.id = entrevistas.empregador_id
    AND e.user_id = auth.uid()
  )
);

-- Candidatos podem ver suas próprias entrevistas
CREATE POLICY "Candidatos podem ver suas entrevistas"
ON public.entrevistas
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = entrevistas.candidato_id
    AND c.user_id = auth.uid()
  )
);

-- Admins podem fazer tudo
CREATE POLICY "Admins podem gerenciar todas entrevistas"
ON public.entrevistas
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ajustar política de candidatos: remover acesso de candidatos a outros candidatos
DROP POLICY IF EXISTS "Candidatos visíveis para empregadores e admins" ON public.candidatos;

CREATE POLICY "Candidatos visíveis para empregadores e admins"
ON public.candidatos
FOR SELECT
USING (
  -- Próprio candidato pode ver seus dados
  (auth.uid() = user_id) 
  OR 
  -- Empregadores podem ver todos os candidatos
  has_role(auth.uid(), 'empregador'::app_role) 
  OR 
  -- Admins podem ver tudo
  has_role(auth.uid(), 'admin'::app_role)
);

-- Criar função para verificar se candidato tem entrevista com empregador
CREATE OR REPLACE FUNCTION public.has_interview_with_employer(_candidato_user_id UUID, _empregador_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.entrevistas ent
    JOIN public.candidatos c ON c.id = ent.candidato_id
    WHERE c.user_id = _candidato_user_id
    AND ent.empregador_id = _empregador_id
  )
$$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_entrevistas_empregador ON public.entrevistas(empregador_id);
CREATE INDEX IF NOT EXISTS idx_entrevistas_candidato ON public.entrevistas(candidato_id);
CREATE INDEX IF NOT EXISTS idx_entrevistas_data ON public.entrevistas(data_entrevista);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_entrevistas_updated_at
BEFORE UPDATE ON public.entrevistas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE public.entrevistas IS 'Tabela de agendamento de entrevistas entre empregadores e candidatos';
COMMENT ON COLUMN public.empregadores.email_empresa IS 'Email da empresa - deve ser exibido apenas para candidatos com entrevistas agendadas';
COMMENT ON COLUMN public.empregadores.telefone_empresa IS 'Telefone da empresa - deve ser exibido apenas para candidatos com entrevistas agendadas';