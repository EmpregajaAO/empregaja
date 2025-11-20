-- Adicionar campos necessários à tabela vagas para o sistema de webhook
-- Campos: external_id (único), origem
-- Os outros campos já existem com nomes similares

-- Adicionar coluna external_id se não existir
ALTER TABLE vagas ADD COLUMN IF NOT EXISTS external_id text UNIQUE;

-- Adicionar coluna origem se não existir
ALTER TABLE vagas ADD COLUMN IF NOT EXISTS origem text;

-- Criar índice para external_id para melhor performance
CREATE INDEX IF NOT EXISTS idx_vagas_external_id ON vagas(external_id);

-- Criar índice para data_publicacao_origem para ordenação
CREATE INDEX IF NOT EXISTS idx_vagas_data_publicacao ON vagas(data_publicacao_origem DESC);

-- Permitir inserções públicas via API (será controlado pelo edge function)
-- O edge function usará o service role key, então não precisa de RLS especial aqui