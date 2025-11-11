-- Corrigir função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Corrigir função gerar_hash_dedup com search_path seguro
CREATE OR REPLACE FUNCTION public.gerar_hash_dedup(
  p_titulo TEXT,
  p_empresa TEXT,
  p_localidade TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    digest(
      lower(trim(p_titulo)) || '|' || 
      lower(trim(p_empresa)) || '|' || 
      lower(trim(p_localidade)),
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE
SET search_path = public;