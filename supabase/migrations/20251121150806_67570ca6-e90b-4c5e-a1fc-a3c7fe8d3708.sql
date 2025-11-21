-- Add missing column to empregadores
ALTER TABLE public.empregadores ADD COLUMN IF NOT EXISTS ramo_atuacao text;

-- Create course_enrollments as an alias view for student_enrollments
CREATE OR REPLACE VIEW public.course_enrollments AS
SELECT * FROM public.student_enrollments;

-- Grant permissions on the view
GRANT SELECT ON public.course_enrollments TO authenticated;

-- Create student_progress view based on lesson_progress
CREATE OR REPLACE VIEW public.student_progress AS
SELECT 
  lp.id,
  lp.enrollment_id,
  lp.lesson_id,
  lp.completed,
  lp.completed_at,
  lp.time_spent_minutes,
  se.student_id,
  se.course_id,
  cl.module_id,
  now() as last_accessed_at
FROM public.lesson_progress lp
JOIN public.student_enrollments se ON se.id = lp.enrollment_id
JOIN public.course_lessons cl ON cl.id = lp.lesson_id;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_progress TO authenticated;

-- Create student_assessment_attempts as alias for assessment_attempts
CREATE OR REPLACE VIEW public.student_assessment_attempts AS
SELECT * FROM public.assessment_attempts;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_assessment_attempts TO authenticated;

-- Create function to generate candidate number
CREATE OR REPLACE FUNCTION public.gerar_numero_candidato()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  numero_candidato text;
  count_candidatos integer;
BEGIN
  SELECT COUNT(*) INTO count_candidatos FROM public.candidatos;
  numero_candidato := 'CAND-' || LPAD((count_candidatos + 1)::text, 6, '0');
  RETURN numero_candidato;
END;
$$;