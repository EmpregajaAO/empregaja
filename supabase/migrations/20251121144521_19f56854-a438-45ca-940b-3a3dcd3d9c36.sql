-- ============================================
-- PARTE 1: SISTEMA DE AUTENTICAÇÃO E ROLES
-- ============================================

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'candidato', 'empregador', 'funcionario');

-- Tabela de roles dos usuários
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função de segurança para verificar roles (SECURITY DEFINER para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
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

-- RLS Policies para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PARTE 2: TABELA DE PERFIS
-- ============================================

CREATE TABLE public.perfis (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome_completo TEXT,
    email TEXT,
    telefone TEXT,
    avatar_url TEXT,
    data_nascimento DATE,
    genero TEXT,
    cidade TEXT,
    provincia TEXT,
    sobre_mim TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    disponibilidade TEXT DEFAULT 'disponivel',
    tipo_conta TEXT DEFAULT 'gratuita',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- RLS Policies para perfis
CREATE POLICY "Perfis públicos são visíveis para todos autenticados"
ON public.perfis FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.perfis FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
ON public.perfis FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins podem fazer tudo em perfis"
ON public.perfis FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_perfis_updated_at
BEFORE UPDATE ON public.perfis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar perfil automaticamente ao registar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome_completo, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.raw_user_meta_data->>'full_name'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PARTE 3: CANDIDATOS
-- ============================================

CREATE TABLE public.candidatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    data_nascimento DATE,
    genero TEXT,
    provincia TEXT,
    cidade TEXT,
    nivel_educacao TEXT,
    area_interesse TEXT[] DEFAULT '{}',
    experiencia_anos INTEGER DEFAULT 0,
    cv_url TEXT,
    carta_apresentacao TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    disponibilidade TEXT DEFAULT 'disponivel',
    pretensao_salarial NUMERIC,
    habilidades TEXT[] DEFAULT '{}',
    idiomas TEXT[] DEFAULT '{}',
    certificacoes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id)
);

ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;

-- RLS Policies para candidatos
CREATE POLICY "Candidatos visíveis para empregadores e admins"
ON public.candidatos FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  public.has_role(auth.uid(), 'empregador') OR
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Candidatos podem atualizar seu próprio perfil"
ON public.candidatos FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Candidatos podem inserir seu próprio perfil"
ON public.candidatos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem fazer tudo em candidatos"
ON public.candidatos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_candidatos_updated_at
BEFORE UPDATE ON public.candidatos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- PARTE 4: EMPREGADORES
-- ============================================

CREATE TABLE public.empregadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nome_empresa TEXT NOT NULL,
    email_empresa TEXT NOT NULL,
    telefone_empresa TEXT,
    website TEXT,
    setor_atividade TEXT,
    descricao_empresa TEXT,
    logo_url TEXT,
    numero_funcionarios TEXT,
    localizacao TEXT,
    provincia TEXT,
    tipo_conta TEXT DEFAULT 'gratuita',
    verificado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id)
);

ALTER TABLE public.empregadores ENABLE ROW LEVEL SECURITY;

-- RLS Policies para empregadores
CREATE POLICY "Empregadores visíveis para todos autenticados"
ON public.empregadores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Empregadores podem atualizar seu próprio perfil"
ON public.empregadores FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Empregadores podem inserir seu próprio perfil"
ON public.empregadores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem fazer tudo em empregadores"
ON public.empregadores FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_empregadores_updated_at
BEFORE UPDATE ON public.empregadores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();