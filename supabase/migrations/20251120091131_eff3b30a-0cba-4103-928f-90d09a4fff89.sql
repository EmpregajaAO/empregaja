-- Habilitar realtime para as tabelas do dashboard financeiro
ALTER TABLE comprovativos_pagamento REPLICA IDENTITY FULL;
ALTER TABLE candidatos REPLICA IDENTITY FULL;
ALTER TABLE course_enrollments REPLICA IDENTITY FULL;

-- Adicionar tabelas à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE comprovativos_pagamento;
ALTER PUBLICATION supabase_realtime ADD TABLE candidatos;
ALTER PUBLICATION supabase_realtime ADD TABLE course_enrollments;