-- ============================================================================
-- FIX: Security Definer View Warnings
-- ============================================================================
-- Change views to SECURITY INVOKER to use querying user's permissions

-- Recreate student_assessment_questions as SECURITY INVOKER
DROP VIEW IF EXISTS student_assessment_questions CASCADE;
CREATE VIEW student_assessment_questions 
WITH (security_invoker = true) AS
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

GRANT SELECT ON student_assessment_questions TO authenticated;

-- Recreate public_job_stats as SECURITY INVOKER
DROP VIEW IF EXISTS public_job_stats CASCADE;
CREATE VIEW public_job_stats 
WITH (security_invoker = true) AS
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

-- Recreate fontes_publicas as SECURITY INVOKER
DROP VIEW IF EXISTS fontes_publicas CASCADE;
CREATE VIEW fontes_publicas 
WITH (security_invoker = true) AS
SELECT 
  COUNT(*) as total_active_sources,
  COUNT(DISTINCT tipo) as source_types
FROM fontes_vagas
WHERE ativa = true;

GRANT SELECT ON fontes_publicas TO anon, authenticated;