-- Adicionar política para permitir que participantes do chat marquem mensagens como lidas
CREATE POLICY "Participantes podem marcar mensagens como lidas"
ON public.mensagens
FOR UPDATE
USING (
  -- Usuário é candidato no chat
  EXISTS (
    SELECT 1 FROM chats c
    JOIN candidatos cand ON cand.id = c.candidato_id
    JOIN perfis p ON p.id = cand.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p.user_id = auth.uid()
  )
  OR
  -- Usuário é empregador no chat
  EXISTS (
    SELECT 1 FROM chats c
    JOIN empregadores emp ON emp.id = c.empregador_id
    JOIN perfis p ON p.id = emp.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  -- Usuário é candidato no chat
  EXISTS (
    SELECT 1 FROM chats c
    JOIN candidatos cand ON cand.id = c.candidato_id
    JOIN perfis p ON p.id = cand.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p.user_id = auth.uid()
  )
  OR
  -- Usuário é empregador no chat
  EXISTS (
    SELECT 1 FROM chats c
    JOIN empregadores emp ON emp.id = c.empregador_id
    JOIN perfis p ON p.id = emp.perfil_id
    WHERE c.id = mensagens.chat_id
    AND p.user_id = auth.uid()
  )
);