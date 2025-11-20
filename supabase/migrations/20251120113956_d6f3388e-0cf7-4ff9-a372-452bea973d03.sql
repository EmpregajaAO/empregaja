-- Remover política antiga que limita apenas a Pro
DROP POLICY IF EXISTS "Empregadores podem ver candidatos Pro" ON candidatos;

-- Criar nova política para empregadores verem todos os candidatos aprovados
CREATE POLICY "Empregadores podem ver todos candidatos aprovados"
ON candidatos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM perfis p
    JOIN empregadores e ON e.perfil_id = p.id
    WHERE p.user_id = auth.uid()
  )
  AND EXISTS (
    SELECT 1
    FROM perfis perfil_candidato
    WHERE perfil_candidato.id = candidatos.perfil_id
    AND perfil_candidato.status_validacao = 'aprovado'
  )
);