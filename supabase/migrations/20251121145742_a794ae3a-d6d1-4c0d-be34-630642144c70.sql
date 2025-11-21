-- Remover a VIEW que causou o warning de segurança
DROP VIEW IF EXISTS public.course_enrollments;

-- Adicionar colunas faltantes
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS status_validacao TEXT DEFAULT 'nao_validado';
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS perfil_id UUID REFERENCES public.perfis(id);

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notificacoes_push (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notificacoes_push ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas notificações"
ON public.notificacoes_push FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins gerenciam notificações"
ON public.notificacoes_push FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar colunas faltantes em course_modules
ALTER TABLE public.course_modules ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;