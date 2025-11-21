-- Criar tabela de comprovativos de pagamento
CREATE TABLE IF NOT EXISTS public.comprovativos_pagamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  tipo_servico TEXT NOT NULL, -- curso, vaga_premium, destaque_perfil
  valor NUMERIC NOT NULL,
  comprovativo_url TEXT NOT NULL,
  dados_ocr JSONB,
  status TEXT DEFAULT 'pendente', -- pendente, aprovado, rejeitado
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.comprovativos_pagamento ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Candidatos podem ver seus comprovativos"
ON public.comprovativos_pagamento FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = comprovativos_pagamento.candidato_id
    AND c.user_id = auth.uid()
  ) OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Candidatos podem inserir seus comprovativos"
ON public.comprovativos_pagamento FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = comprovativos_pagamento.candidato_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem gerenciar comprovativos"
ON public.comprovativos_pagamento FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Índice
CREATE INDEX IF NOT EXISTS idx_comprovativos_candidato ON public.comprovativos_pagamento(candidato_id);
CREATE INDEX IF NOT EXISTS idx_comprovativos_status ON public.comprovativos_pagamento(status);

-- Trigger
CREATE TRIGGER update_comprovativos_pagamento_updated_at
BEFORE UPDATE ON public.comprovativos_pagamento
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();