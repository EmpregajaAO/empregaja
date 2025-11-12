-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'funcionario', 'candidato', 'empregador');

-- Create user_roles table (CRITICAL: Roles stored separately for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create funcionarios table
CREATE TABLE public.funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfil_id UUID REFERENCES public.perfis(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  salario_base NUMERIC NOT NULL,
  data_admissao DATE NOT NULL DEFAULT CURRENT_DATE,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

-- Create salarios table
CREATE TABLE public.salarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL,
  valor NUMERIC NOT NULL,
  bonificacoes NUMERIC DEFAULT 0,
  deducoes NUMERIC DEFAULT 0,
  valor_liquido NUMERIC NOT NULL,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(funcionario_id, mes, ano)
);

ALTER TABLE public.salarios ENABLE ROW LEVEL SECURITY;

-- Create notificacoes_push table
CREATE TABLE public.notificacoes_push (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadados JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.notificacoes_push ENABLE ROW LEVEL SECURITY;

-- Add status_validacao to perfis if not exists
ALTER TABLE public.perfis 
ADD COLUMN IF NOT EXISTS status_validacao TEXT DEFAULT 'pendente' CHECK (status_validacao IN ('pendente', 'aprovado', 'rejeitado'));

ALTER TABLE public.perfis
ADD COLUMN IF NOT EXISTS data_validacao TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.perfis
ADD COLUMN IF NOT EXISTS validado_por UUID REFERENCES auth.users(id);

-- RLS policies for funcionarios
CREATE POLICY "Admins can manage funcionarios"
ON public.funcionarios
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Funcionarios can view their own data"
ON public.funcionarios
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.perfis
  WHERE perfis.id = funcionarios.perfil_id
  AND perfis.user_id = auth.uid()
));

-- RLS policies for salarios
CREATE POLICY "Admins can manage salarios"
ON public.salarios
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Funcionarios can view their own salarios"
ON public.salarios
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.funcionarios f
  JOIN public.perfis p ON p.id = f.perfil_id
  WHERE f.id = salarios.funcionario_id
  AND p.user_id = auth.uid()
));

-- RLS policies for notificacoes_push
CREATE POLICY "Admins can manage all notificacoes"
ON public.notificacoes_push
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own notificacoes"
ON public.notificacoes_push
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notificacoes"
ON public.notificacoes_push
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_funcionarios_updated_at
BEFORE UPDATE ON public.funcionarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_salarios_updated_at
BEFORE UPDATE ON public.salarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();