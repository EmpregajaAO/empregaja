-- Criar tabela de funcionários
CREATE TABLE IF NOT EXISTS public.funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID NOT NULL REFERENCES public.perfis(id) ON DELETE CASCADE,
  cargo TEXT NOT NULL,
  salario_base NUMERIC NOT NULL,
  data_admissao DATE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar alias course_enrollments apontando para student_enrollments
CREATE VIEW public.course_enrollments AS 
SELECT 
  id,
  student_id,
  course_id,
  enrolled_at,
  completed_at,
  progress_percentage,
  status,
  false as payment_verified
FROM public.student_enrollments;

-- Habilitar RLS
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Políticas para funcionários
CREATE POLICY "Admins podem gerenciar funcionários"
ON public.funcionarios FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Funcionários podem ver seu próprio perfil"
ON public.funcionarios FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.perfis p
    WHERE p.id = funcionarios.perfil_id
    AND p.id = auth.uid()
  )
);

-- Adicionar colunas faltantes em candidatos
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS tipo_conta TEXT DEFAULT 'gratuita';
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS status_validacao TEXT DEFAULT 'nao_validado';

-- Adicionar colunas faltantes em student_enrollments
ALTER TABLE public.student_enrollments ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT false;

-- Índices
CREATE INDEX IF NOT EXISTS idx_funcionarios_perfil ON public.funcionarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_ativo ON public.funcionarios(ativo);

-- Trigger
CREATE TRIGGER update_funcionarios_updated_at
BEFORE UPDATE ON public.funcionarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();