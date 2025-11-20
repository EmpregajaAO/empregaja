import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, Eye, GraduationCap, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeSection from "@/components/candidate/WelcomeSection";
import ProfileSection from "@/components/candidate/ProfileSection";
import CurriculumSection from "@/components/candidate/CurriculumSection";
import AccessSection from "@/components/candidate/AccessSection";
import CoursesSection from "@/components/candidate/CoursesSection";
import CandidateChats from "@/components/candidate/CandidateChats";

interface Candidato {
  id: string;
  numero_candidato: string;
  tipo_conta: string;
  cv_url: string | null;
  perfil_id: string;
  perfis: {
    id: string;
    nome_completo: string;
    telefone: string | null;
    status_validacao: string;
  };
}

interface Visualizacao {
  id: string;
  visualizado_em: string;
  empregadores: {
    nome_empresa: string;
    ramo_atuacao: string;
  };
}

interface Comprovativo {
  status: string;
}

export default function PerfilCandidato() {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [visualizacoes, setVisualizacoes] = useState<Visualizacao[]>([]);
  const [statusPagamento, setStatusPagamento] = useState<string>("pendente");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidatoData();
  }, []);

  const loadCandidatoData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      // Buscar dados do candidato
      const { data: candidatoData, error: candidatoError } = await supabase
        .from("candidatos")
        .select(`
          *,
          perfis (
            id,
            nome_completo,
            telefone,
            status_validacao
          )
        `)
        .eq("perfis.user_id", user.id)
        .single();

      if (candidatoError) throw candidatoError;
      setCandidato(candidatoData);

      // Buscar status do pagamento
      const { data: comprovantivoData } = await supabase
        .from("comprovativos_pagamento")
        .select("status")
        .eq("candidato_id", candidatoData.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (comprovantivoData) {
        setStatusPagamento(comprovantivoData.status);
      }

      // Buscar visualizações do perfil
      const { data: visualizacoesData, error: visualizacoesError } = await supabase
        .from("visualizacoes_perfil")
        .select(`
          *,
          empregadores (
            nome_empresa,
            ramo_atuacao
          )
        `)
        .eq("candidato_id", candidatoData.id)
        .order("visualizado_em", { ascending: false });

      if (visualizacoesError) throw visualizacoesError;
      setVisualizacoes(visualizacoesData || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p>A carregar...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!candidato) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Perfil não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Você precisa criar um perfil de candidato primeiro.
            </p>
            <button 
              onClick={() => navigate("/cadastro")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Criar Perfil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {candidato.perfis.status_validacao === "pendente" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⏳ Seu perfil está pendente de validação. Aguarde a aprovação do administrador para acessar todas as funcionalidades.
            </p>
          </div>
        )}
        
        {candidato.perfis.status_validacao === "rejeitado" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              ❌ Seu perfil foi rejeitado. Entre em contato com o suporte para mais informações.
            </p>
          </div>
        )}

        <WelcomeSection
          nome={candidato.perfis.nome_completo}
          tipoConta={candidato.tipo_conta}
          statusPagamento={statusPagamento}
        />

        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong>Dica:</strong> Mantenha seu painel atualizado e completo para aumentar sua visibilidade. 
            Seu currículo, documentos e histórico de cursos estão seguros e disponíveis para download sempre que precisar.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Currículo</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Mensagens</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Acessos</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Cursos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection
              candidatoId={candidato.id}
              nomeCompleto={candidato.perfis.nome_completo}
              telefone={candidato.perfis.telefone}
              onUpdate={loadCandidatoData}
            />
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <CurriculumSection
              candidatoData={candidato}
              tipoConta={candidato.tipo_conta}
            />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <CandidateChats 
              candidatoId={candidato.id} 
              perfilId={candidato.perfis.id}
            />
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <AccessSection visualizacoes={visualizacoes} />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CoursesSection candidatoId={candidato.id} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
