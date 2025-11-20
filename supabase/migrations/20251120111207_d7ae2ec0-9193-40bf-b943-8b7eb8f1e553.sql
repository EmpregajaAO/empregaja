
-- Recriar a função gerar_hash_dedup com tipo correto
DROP FUNCTION IF EXISTS gerar_hash_dedup(text, text, text);

CREATE OR REPLACE FUNCTION public.gerar_hash_dedup(p_titulo text, p_empresa text, p_localidade text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN encode(
    digest(
      lower(trim(p_titulo)) || '|' || 
      lower(trim(p_empresa)) || '|' || 
      lower(trim(p_localidade)),
      'sha256'::text
    ),
    'hex'
  );
END;
$function$;
