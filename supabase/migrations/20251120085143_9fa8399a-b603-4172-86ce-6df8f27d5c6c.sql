-- Adicionar políticas RLS para admins gerenciarem vagas
CREATE POLICY "Admins podem inserir vagas"
ON public.vagas
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar vagas"
ON public.vagas
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar vagas"
ON public.vagas
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar políticas RLS para admins gerenciarem cursos
CREATE POLICY "Admins podem inserir cursos"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem atualizar cursos"
ON public.courses
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar cursos"
ON public.courses
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar políticas RLS para admins gerenciarem comprovativos
CREATE POLICY "Admins podem atualizar comprovativos"
ON public.comprovativos_pagamento
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem ver todos comprovativos"
ON public.comprovativos_pagamento
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar políticas RLS para admins atualizarem candidatos (para conta pro)
CREATE POLICY "Admins podem atualizar candidatos"
ON public.candidatos
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar políticas RLS para admins atualizarem perfis
CREATE POLICY "Admins podem atualizar perfis"
ON public.perfis
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem ver todos perfis"
ON public.perfis
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem deletar perfis"
ON public.perfis
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));