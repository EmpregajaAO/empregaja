-- Adicionar coluna tipo_utilizador na tabela perfis
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS tipo_utilizador TEXT;

-- Criar tabelas para o sistema de cursos
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration_hours INTEGER,
  level TEXT, -- iniciante, intermediario, avancado
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- video, audio, text, pdf
  content_text TEXT,
  video_url TEXT,
  audio_url TEXT,
  pdf_url TEXT,
  duration_minutes INTEGER,
  order_number INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.course_assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- multipla_escolha, verdadeiro_falso, dissertativa
  options JSONB, -- array de opções para múltipla escolha
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo', -- ativo, concluido, suspenso
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(enrollment_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.student_enrollments(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.course_assessments(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas para cursos (visíveis para todos autenticados)
CREATE POLICY "Cursos visíveis para todos autenticados"
ON public.courses FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins podem gerenciar cursos"
ON public.courses FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para módulos
CREATE POLICY "Módulos visíveis para alunos matriculados"
ON public.course_modules FOR SELECT
USING (
  is_active = true AND (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.candidatos c ON c.id = se.student_id
      WHERE se.course_id = course_modules.course_id
      AND c.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Admins podem gerenciar módulos"
ON public.course_modules FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para aulas
CREATE POLICY "Aulas visíveis para alunos matriculados"
ON public.course_lessons FOR SELECT
USING (
  is_active = true AND (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.candidatos c ON c.id = se.student_id
      JOIN public.course_modules cm ON cm.id = course_lessons.module_id
      WHERE se.course_id = cm.course_id
      AND c.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Admins podem gerenciar aulas"
ON public.course_lessons FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para avaliações
CREATE POLICY "Avaliações visíveis para alunos matriculados"
ON public.course_assessments FOR SELECT
USING (
  is_active = true AND (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.candidatos c ON c.id = se.student_id
      JOIN public.course_modules cm ON cm.id = course_assessments.module_id
      WHERE se.course_id = cm.course_id
      AND c.user_id = auth.uid()
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Admins podem gerenciar avaliações"
ON public.course_assessments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para questões
CREATE POLICY "Questões visíveis para alunos durante avaliação"
ON public.assessment_questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.course_assessments ca
    JOIN public.course_modules cm ON cm.id = ca.module_id
    JOIN public.student_enrollments se ON se.course_id = cm.course_id
    JOIN public.candidatos c ON c.id = se.student_id
    WHERE ca.id = assessment_questions.assessment_id
    AND c.user_id = auth.uid()
  ) OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins podem gerenciar questões"
ON public.assessment_questions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para matrículas
CREATE POLICY "Alunos podem ver suas matrículas"
ON public.student_enrollments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = student_enrollments.student_id
    AND c.user_id = auth.uid()
  ) OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins podem gerenciar matrículas"
ON public.student_enrollments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para progresso de aulas
CREATE POLICY "Alunos podem gerenciar seu progresso"
ON public.lesson_progress FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.candidatos c ON c.id = se.student_id
    WHERE se.id = lesson_progress.enrollment_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todo progresso"
ON public.lesson_progress FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para tentativas de avaliação
CREATE POLICY "Alunos podem gerenciar suas tentativas"
ON public.assessment_attempts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.candidatos c ON c.id = se.student_id
    WHERE se.id = assessment_attempts.enrollment_id
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todas tentativas"
ON public.assessment_attempts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON public.course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_assessments_module ON public.course_assessments(module_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON public.student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_course ON public.student_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON public.lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_enrollment ON public.assessment_attempts(enrollment_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
BEFORE UPDATE ON public.course_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
BEFORE UPDATE ON public.course_lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_assessments_updated_at
BEFORE UPDATE ON public.course_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();