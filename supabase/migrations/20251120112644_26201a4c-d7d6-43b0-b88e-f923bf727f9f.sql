-- Tornar candidato_id nullable e adicionar empregador_id
ALTER TABLE course_enrollments 
  ALTER COLUMN candidato_id DROP NOT NULL,
  ADD COLUMN empregador_id uuid REFERENCES empregadores(id) ON DELETE CASCADE;

-- Adicionar constraint para garantir que pelo menos um está preenchido
ALTER TABLE course_enrollments
  ADD CONSTRAINT check_student_type CHECK (
    (candidato_id IS NOT NULL AND empregador_id IS NULL) OR
    (candidato_id IS NULL AND empregador_id IS NOT NULL)
  );

-- Atualizar RLS policies para incluir empregadores
DROP POLICY IF EXISTS "Alunos podem se matricular" ON course_enrollments;
DROP POLICY IF EXISTS "Alunos veem suas próprias matrículas" ON course_enrollments;

CREATE POLICY "Candidatos e empregadores podem se matricular"
ON course_enrollments
FOR INSERT
WITH CHECK (
  (candidato_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM candidatos c
    JOIN perfis p ON p.id = c.perfil_id
    WHERE c.id = course_enrollments.candidato_id AND p.user_id = auth.uid()
  )) OR
  (empregador_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM empregadores e
    JOIN perfis p ON p.id = e.perfil_id
    WHERE e.id = course_enrollments.empregador_id AND p.user_id = auth.uid()
  ))
);

CREATE POLICY "Alunos veem suas próprias matrículas"
ON course_enrollments
FOR SELECT
USING (
  (candidato_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM candidatos c
    JOIN perfis p ON p.id = c.perfil_id
    WHERE c.id = course_enrollments.candidato_id AND p.user_id = auth.uid()
  )) OR
  (empregador_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM empregadores e
    JOIN perfis p ON p.id = e.perfil_id
    WHERE e.id = course_enrollments.empregador_id AND p.user_id = auth.uid()
  ))
);

-- Atualizar policies de progresso para incluir empregadores
DROP POLICY IF EXISTS "Alunos atualizam seu progresso" ON student_progress;
DROP POLICY IF EXISTS "Alunos veem seu próprio progresso" ON student_progress;

CREATE POLICY "Estudantes atualizam seu progresso"
ON student_progress
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = student_progress.enrollment_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Estudantes veem seu próprio progresso"
ON student_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = student_progress.enrollment_id AND p.user_id = auth.uid()
  )
);

-- Atualizar policies de chat para incluir empregadores
DROP POLICY IF EXISTS "Alunos podem enviar mensagens" ON course_chat_messages;
DROP POLICY IF EXISTS "Alunos veem suas próprias mensagens" ON course_chat_messages;

CREATE POLICY "Estudantes podem enviar mensagens"
ON course_chat_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = course_chat_messages.enrollment_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Estudantes veem suas próprias mensagens"
ON course_chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = course_chat_messages.enrollment_id AND p.user_id = auth.uid()
  )
);

-- Atualizar policies de tentativas de avaliação
DROP POLICY IF EXISTS "Alunos podem criar tentativas" ON student_assessment_attempts;
DROP POLICY IF EXISTS "Alunos veem suas próprias tentativas" ON student_assessment_attempts;

CREATE POLICY "Estudantes podem criar tentativas"
ON student_assessment_attempts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = student_assessment_attempts.enrollment_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Estudantes veem suas próprias tentativas"
ON student_assessment_attempts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = student_assessment_attempts.enrollment_id AND p.user_id = auth.uid()
  )
);

-- Atualizar policies de certificados
DROP POLICY IF EXISTS "Students view own certificates" ON certificates;

CREATE POLICY "Estudantes veem seus próprios certificados"
ON certificates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_enrollments ce
    LEFT JOIN candidatos c ON c.id = ce.candidato_id
    LEFT JOIN empregadores e ON e.id = ce.empregador_id
    LEFT JOIN perfis p ON p.id = COALESCE(c.perfil_id, e.perfil_id)
    WHERE ce.id = certificates.enrollment_id AND p.user_id = auth.uid()
  )
);