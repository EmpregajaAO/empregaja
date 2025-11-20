-- Adicionar coluna para data de expiração das vagas
ALTER TABLE vagas 
ADD COLUMN data_expiracao DATE;

-- Criar índice para melhorar performance de consultas por data de expiração
CREATE INDEX idx_vagas_data_expiracao ON vagas(data_expiracao) WHERE ativa = true;

-- Adicionar comentário explicativo
COMMENT ON COLUMN vagas.data_expiracao IS 'Data limite para candidatura à vaga';