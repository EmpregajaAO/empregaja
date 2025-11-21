-- Create chats table for employer-candidate communication
CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id uuid REFERENCES public.candidatos(id) ON DELETE CASCADE NOT NULL,
  empregador_id uuid REFERENCES public.empregadores(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(candidato_id, empregador_id)
);

-- Create mensagens table for chat messages
CREATE TABLE IF NOT EXISTS public.mensagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  remetente_id uuid NOT NULL,
  mensagem text NOT NULL,
  lida boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create visualizacoes_perfil table for tracking profile views
CREATE TABLE IF NOT EXISTS public.visualizacoes_perfil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id uuid REFERENCES public.candidatos(id) ON DELETE CASCADE NOT NULL,
  empregador_id uuid REFERENCES public.empregadores(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now() NOT NULL
);

-- Create course_chat_messages table for course assistant
CREATE TABLE IF NOT EXISTS public.course_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES public.student_enrollments(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('student', 'assistant')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visualizacoes_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chats
CREATE POLICY "Candidatos podem ver seus chats"
  ON public.chats FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = chats.candidato_id AND c.user_id = auth.uid()
  ));

CREATE POLICY "Empregadores podem ver seus chats"
  ON public.chats FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.empregadores e
    WHERE e.id = chats.empregador_id AND e.user_id = auth.uid()
  ));

CREATE POLICY "Candidatos e empregadores podem criar chats"
  ON public.chats FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.candidatos c WHERE c.id = chats.candidato_id AND c.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.empregadores e WHERE e.id = chats.empregador_id AND e.user_id = auth.uid())
  );

-- RLS Policies for mensagens
CREATE POLICY "Usuários podem ver mensagens dos seus chats"
  ON public.mensagens FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chats ch
    WHERE ch.id = mensagens.chat_id
    AND (
      EXISTS (SELECT 1 FROM public.candidatos c WHERE c.id = ch.candidato_id AND c.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.empregadores e WHERE e.id = ch.empregador_id AND e.user_id = auth.uid())
    )
  ));

CREATE POLICY "Usuários podem inserir mensagens nos seus chats"
  ON public.mensagens FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.chats ch
    WHERE ch.id = mensagens.chat_id
    AND (
      EXISTS (SELECT 1 FROM public.candidatos c WHERE c.id = ch.candidato_id AND c.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.empregadores e WHERE e.id = ch.empregador_id AND e.user_id = auth.uid())
    )
  ));

CREATE POLICY "Usuários podem atualizar mensagens (marcar como lida)"
  ON public.mensagens FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.chats ch
    WHERE ch.id = mensagens.chat_id
    AND (
      EXISTS (SELECT 1 FROM public.candidatos c WHERE c.id = ch.candidato_id AND c.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.empregadores e WHERE e.id = ch.empregador_id AND e.user_id = auth.uid())
    )
  ));

-- RLS Policies for visualizacoes_perfil
CREATE POLICY "Empregadores podem inserir visualizações"
  ON public.visualizacoes_perfil FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.empregadores e
    WHERE e.id = visualizacoes_perfil.empregador_id AND e.user_id = auth.uid()
  ));

CREATE POLICY "Candidatos podem ver quem visualizou seu perfil"
  ON public.visualizacoes_perfil FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidatos c
    WHERE c.id = visualizacoes_perfil.candidato_id AND c.user_id = auth.uid()
  ));

-- RLS Policies for course_chat_messages
CREATE POLICY "Alunos podem gerenciar mensagens dos seus cursos"
  ON public.course_chat_messages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.candidatos c ON c.id = se.student_id
    WHERE se.id = course_chat_messages.enrollment_id AND c.user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON public.chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chats_candidato ON public.chats(candidato_id);
CREATE INDEX IF NOT EXISTS idx_chats_empregador ON public.chats(empregador_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_chat ON public.mensagens(chat_id);
CREATE INDEX IF NOT EXISTS idx_visualizacoes_candidato ON public.visualizacoes_perfil(candidato_id);
CREATE INDEX IF NOT EXISTS idx_course_chat_enrollment ON public.course_chat_messages(enrollment_id);