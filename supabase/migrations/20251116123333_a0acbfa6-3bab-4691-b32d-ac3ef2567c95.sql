-- ====================================
-- SISTEMA COMPLETO DE CURSOS - EMPREGAJA LMS
-- ====================================

-- 1. TABELA DE CURSOS
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price_kz NUMERIC NOT NULL,
  duration_weeks INTEGER NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'iniciante', -- iniciante, intermediario, avancado
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  total_modules INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  passing_score NUMERIC DEFAULT 50, -- nota mínima para aprovação (%)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MÓDULOS DOS CURSOS
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false, -- bloqueia até completar módulo anterior
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- 3. AULAS (LIÇÕES) DOS MÓDULOS
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- 'text', 'video', 'audio', 'pdf', 'interactive'
  content_text TEXT, -- conteúdo em texto
  video_url TEXT, -- URL do vídeo ou script
  audio_url TEXT, -- URL do áudio ou script
  pdf_url TEXT, -- URL do PDF
  duration_minutes INTEGER, -- duração estimada
  order_number INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- permite visualizar sem matrícula
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, order_number)
);

-- 4. MATRÍCULAS DOS ALUNOS
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- active, completed, dropped
  payment_verified BOOLEAN DEFAULT false,
  comprovativo_id UUID REFERENCES public.comprovativos_pagamento(id),
  certificate_issued BOOLEAN DEFAULT false,
  final_score NUMERIC, -- nota final do curso
  UNIQUE(course_id, candidato_id)
);

-- 5. PROGRESSO DO ALUNO
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);

-- 6. AVALIAÇÕES (TESTES)
CREATE TABLE public.course_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL, -- 'module_quiz', 'final_exam'
  passing_score NUMERIC DEFAULT 50,
  time_limit_minutes INTEGER, -- tempo limite (opcional)
  max_attempts INTEGER DEFAULT 3, -- número máximo de tentativas
  order_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PERGUNTAS DAS AVALIAÇÕES
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.course_assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, true_false, essay
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT NOT NULL, -- 'A', 'B', 'C', 'D' ou texto
  explanation TEXT, -- explicação da resposta correta
  points NUMERIC DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TENTATIVAS DE AVALIAÇÃO
CREATE TABLE public.student_assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.course_assessments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score NUMERIC, -- pontuação obtida
  max_score NUMERIC, -- pontuação máxima possível
  percentage NUMERIC, -- percentual (score/max_score * 100)
  passed BOOLEAN,
  answers JSONB, -- respostas do aluno {question_id: answer}
  time_taken_minutes INTEGER,
  UNIQUE(enrollment_id, assessment_id, attempt_number)
);

-- 9. CERTIFICADOS
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE, -- número único do certificado
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completion_date DATE NOT NULL,
  final_score NUMERIC NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  pdf_url TEXT, -- URL do certificado em PDF
  verification_code TEXT UNIQUE, -- código para verificar autenticidade
  UNIQUE(enrollment_id)
);

-- 10. CHAT DE DÚVIDAS (IA)
CREATE TABLE public.course_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL, -- 'student', 'ai_assistant'
  message_text TEXT NOT NULL,
  message_metadata JSONB, -- contexto adicional
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================

CREATE INDEX idx_course_modules_course ON course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX idx_enrollments_candidato ON course_enrollments(candidato_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_student_progress_enrollment ON student_progress(enrollment_id);
CREATE INDEX idx_student_progress_lesson ON student_progress(lesson_id);
CREATE INDEX idx_assessment_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX idx_student_attempts_enrollment ON student_assessment_attempts(enrollment_id);
CREATE INDEX idx_student_attempts_assessment ON student_assessment_attempts(assessment_id);
CREATE INDEX idx_certificates_enrollment ON certificates(enrollment_id);
CREATE INDEX idx_chat_messages_enrollment ON course_chat_messages(enrollment_id);

-- ====================================
-- TRIGGERS PARA UPDATED_AT
-- ====================================

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_assessments_updated_at
  BEFORE UPDATE ON public.course_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ====================================
-- FUNÇÕES ÚTEIS
-- ====================================

-- Gerar número único de certificado
CREATE OR REPLACE FUNCTION public.gerar_numero_certificado()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  numero TEXT;
  existe BOOLEAN;
BEGIN
  LOOP
    numero := 'CERT-EJ-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM certificates WHERE certificate_number = numero) INTO existe;
    EXIT WHEN NOT existe;
  END LOOP;
  RETURN numero;
END;
$$;

-- Calcular progresso do curso
CREATE OR REPLACE FUNCTION public.calculate_course_progress(p_enrollment_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress NUMERIC;
BEGIN
  -- Contar total de aulas do curso
  SELECT COUNT(cl.id) INTO total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  JOIN course_enrollments ce ON cm.course_id = ce.course_id
  WHERE ce.id = p_enrollment_id;
  
  -- Contar aulas completadas
  SELECT COUNT(*) INTO completed_lessons
  FROM student_progress sp
  WHERE sp.enrollment_id = p_enrollment_id AND sp.completed = true;
  
  -- Calcular percentual
  IF total_lessons > 0 THEN
    progress := (completed_lessons::NUMERIC / total_lessons::NUMERIC) * 100;
  ELSE
    progress := 0;
  END IF;
  
  RETURN ROUND(progress, 2);
END;
$$;

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para COURSES (visível para todos, admin gerencia)
CREATE POLICY "Cursos visíveis publicamente" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins podem gerenciar cursos" ON courses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para MODULES
CREATE POLICY "Módulos visíveis para alunos matriculados" ON course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.course_id = course_modules.course_id
        AND p.user_id = auth.uid()
        AND ce.payment_verified = true
    )
  );

CREATE POLICY "Admins podem gerenciar módulos" ON course_modules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para LESSONS
CREATE POLICY "Aulas visíveis para alunos matriculados" ON course_lessons
  FOR SELECT USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN course_enrollments ce ON ce.course_id = cm.course_id
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE cm.id = course_lessons.module_id
        AND p.user_id = auth.uid()
        AND ce.payment_verified = true
    )
  );

CREATE POLICY "Admins podem gerenciar aulas" ON course_lessons
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para ENROLLMENTS
CREATE POLICY "Alunos veem suas próprias matrículas" ON course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM candidatos c
      JOIN perfis p ON p.id = c.perfil_id
      WHERE c.id = course_enrollments.candidato_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Alunos podem se matricular" ON course_enrollments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM candidatos c
      JOIN perfis p ON p.id = c.perfil_id
      WHERE c.id = course_enrollments.candidato_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem gerenciar matrículas" ON course_enrollments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para PROGRESS
CREATE POLICY "Alunos veem seu próprio progresso" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = student_progress.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Alunos atualizam seu progresso" ON student_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = student_progress.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

-- Políticas para ASSESSMENTS
CREATE POLICY "Avaliações visíveis para alunos matriculados" ON course_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE (ce.course_id = course_assessments.course_id)
        AND p.user_id = auth.uid()
        AND ce.payment_verified = true
    )
  );

CREATE POLICY "Admins podem gerenciar avaliações" ON course_assessments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para QUESTIONS
CREATE POLICY "Perguntas visíveis para alunos matriculados" ON assessment_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_assessments ca
      JOIN course_enrollments ce ON (ce.course_id = ca.course_id)
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ca.id = assessment_questions.assessment_id
        AND p.user_id = auth.uid()
        AND ce.payment_verified = true
    )
  );

CREATE POLICY "Admins podem gerenciar perguntas" ON assessment_questions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para ATTEMPTS
CREATE POLICY "Alunos veem suas próprias tentativas" ON student_assessment_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = student_assessment_attempts.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Alunos podem criar tentativas" ON student_assessment_attempts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = student_assessment_attempts.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem ver todas as tentativas" ON student_assessment_attempts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para CERTIFICATES
CREATE POLICY "Certificados visíveis publicamente para verificação" ON certificates
  FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar certificados" ON certificates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para CHAT MESSAGES
CREATE POLICY "Alunos veem suas próprias mensagens" ON course_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = course_chat_messages.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Alunos podem enviar mensagens" ON course_chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN candidatos c ON c.id = ce.candidato_id
      JOIN perfis p ON p.id = c.perfil_id
      WHERE ce.id = course_chat_messages.enrollment_id
        AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins podem gerenciar chat" ON course_chat_messages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));