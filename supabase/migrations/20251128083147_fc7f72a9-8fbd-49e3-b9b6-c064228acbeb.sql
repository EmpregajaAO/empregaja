-- Adicionar coluna perfil_id em empregadores
ALTER TABLE public.empregadores ADD COLUMN IF NOT EXISTS perfil_id uuid;

-- Adicionar foreign key de empregadores para perfis  
ALTER TABLE public.empregadores 
ADD CONSTRAINT empregadores_perfil_id_fkey 
FOREIGN KEY (perfil_id) REFERENCES public.perfis(id) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_empregadores_perfil_id ON public.empregadores(perfil_id);

-- Criar função para calcular progresso do curso
CREATE OR REPLACE FUNCTION public.calculate_course_progress(p_enrollment_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_lessons integer;
  v_completed_lessons integer;
  v_progress integer;
BEGIN
  -- Contar total de aulas do curso
  SELECT COUNT(DISTINCT cl.id) INTO v_total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cm.id = cl.module_id
  JOIN student_enrollments se ON se.course_id = cm.course_id
  WHERE se.id = p_enrollment_id AND cl.is_active = true;
  
  -- Contar aulas completadas
  SELECT COUNT(*) INTO v_completed_lessons
  FROM lesson_progress lp
  WHERE lp.enrollment_id = p_enrollment_id AND lp.completed = true;
  
  -- Calcular percentagem
  IF v_total_lessons > 0 THEN
    v_progress := ROUND((v_completed_lessons::numeric / v_total_lessons::numeric) * 100);
  ELSE
    v_progress := 0;
  END IF;
  
  RETURN v_progress;
END;
$$;