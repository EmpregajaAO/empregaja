-- Fix security vulnerabilities in database functions
-- Add search_path protection to prevent search path attacks

-- Drop and recreate gerar_numero_certificado with search_path
DROP FUNCTION IF EXISTS public.gerar_numero_certificado();

CREATE OR REPLACE FUNCTION public.gerar_numero_certificado()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Drop and recreate calculate_course_progress with search_path
DROP FUNCTION IF EXISTS public.calculate_course_progress(uuid);

CREATE OR REPLACE FUNCTION public.calculate_course_progress(p_enrollment_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Create storage bucket for comprovativos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comprovativos',
  'comprovativos',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for comprovativos bucket
CREATE POLICY "Candidatos podem fazer upload dos seus comprovativos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'comprovativos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins podem ver todos os comprovativos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'comprovativos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Candidatos podem ver seus próprios comprovativos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'comprovativos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins podem deletar comprovativos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'comprovativos'
  AND has_role(auth.uid(), 'admin'::app_role)
);