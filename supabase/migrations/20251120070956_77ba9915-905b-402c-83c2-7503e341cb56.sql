-- Remover constraint que pode estar causando problemas
ALTER TABLE perfis DROP CONSTRAINT IF EXISTS perfis_user_id_fkey;

-- Adicionar constraint com cascade correto
ALTER TABLE perfis 
ADD CONSTRAINT perfis_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;