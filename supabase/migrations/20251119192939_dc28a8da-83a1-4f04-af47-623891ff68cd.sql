-- ============================================================================
-- SECURITY FIX: Address All Error-Level Vulnerabilities
-- ============================================================================

-- 1. FIX: Hide Test Answers from Students (CRITICAL)
-- ============================================================================

-- Create safe view for students WITHOUT correct_answer
CREATE VIEW student_assessment_questions AS
SELECT 
  id,
  assessment_id,
  question_text,
  question_type,
  option_a,
  option_b,
  option_c,
  option_d,
  points,
  order_number,
  explanation
FROM assessment_questions;

-- Grant access to authenticated users
GRANT SELECT ON student_assessment_questions TO authenticated;

-- Drop existing dangerous policy
DROP POLICY IF EXISTS "Perguntas visíveis para alunos matriculados" ON assessment_questions;

-- Block direct student access to base table
CREATE POLICY "Students cannot access questions table directly"
ON assessment_questions FOR SELECT
USING (false);

-- Only admins can see complete question data with answers
CREATE POLICY "Admins can manage all questions"
ON assessment_questions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));


-- 2. FIX: Secure Certificates Table (Privacy Protection)
-- ============================================================================

-- Drop public access policy
DROP POLICY IF EXISTS "Certificados visíveis publicamente para verificação" ON certificates;

-- Students can view their own certificates
CREATE POLICY "Students view own certificates"
ON certificates FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM course_enrollments ce
    JOIN candidatos c ON c.id = ce.candidato_id
    JOIN perfis p ON p.id = c.perfil_id
    WHERE ce.id = certificates.enrollment_id 
      AND p.user_id = auth.uid()
  )
);

-- Admins can manage all certificates
CREATE POLICY "Admins manage all certificates"
ON certificates FOR ALL
USING (public.has_role(auth.uid(), 'admin'));


-- 3. FIX: Restrict logs_coleta to Admins Only
-- ============================================================================

-- Drop public policy
DROP POLICY IF EXISTS "Logs visíveis publicamente" ON logs_coleta;

-- Only admins can view collection logs
CREATE POLICY "Admins can view logs"
ON logs_coleta FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage logs
CREATE POLICY "Admins can manage logs"
ON logs_coleta FOR ALL
USING (public.has_role(auth.uid(), 'admin'));


-- 4. FIX: Restrict fontes_vagas to Admins Only
-- ============================================================================

-- Drop public policy
DROP POLICY IF EXISTS "Fontes visíveis publicamente" ON fontes_vagas;

-- Only admins can view job sources
CREATE POLICY "Admins can view fontes"
ON fontes_vagas FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage sources
CREATE POLICY "Admins can manage fontes"
ON fontes_vagas FOR ALL
USING (public.has_role(auth.uid(), 'admin'));


-- ============================================================================
-- Create public statistics views (safe alternatives)
-- ============================================================================

-- Safe public view for job statistics (no sensitive data)
CREATE VIEW public_job_stats AS
SELECT 
  COUNT(DISTINCT fonte_id) as total_sources,
  SUM(vagas_novas) as total_new_jobs,
  DATE(created_at) as collection_date
FROM logs_coleta
WHERE status = 'sucesso'
GROUP BY DATE(created_at)
ORDER BY collection_date DESC
LIMIT 30;

GRANT SELECT ON public_job_stats TO anon, authenticated;

-- Safe public view for active job source count (no URLs or config)
CREATE VIEW fontes_publicas AS
SELECT 
  COUNT(*) as total_active_sources,
  COUNT(DISTINCT tipo) as source_types
FROM fontes_vagas
WHERE ativa = true;

GRANT SELECT ON fontes_publicas TO anon, authenticated;