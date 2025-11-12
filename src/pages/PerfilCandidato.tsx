import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User, Eye, MessageSquare, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Candidato {
  id: string;
  numero_candidato: string;
  tipo_conta: string;
  cv_url: string | null;
  perfis: {
    nome_completo: string;
    telefone: string | null;
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

export default function PerfilCandidato() {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [visualizacoes, setVisualizacoes] = useState<Visualizacao[]>([]);
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
            nome_completo,
            telefone
          )
        `)
        .eq("perfis.user_id", user.id)
        .single();

      if (candidatoError) throw candidatoError;
      setCandidato(candidatoData);

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

  const getTipoConta = (tipo: string) => {
    switch (tipo) {
      case "pro":
        return { label: "Pro", color: "bg-gradient-to-r from-yellow-500 to-orange-500" };
      case "ativo":
        return { label: "Ativo", color: "bg-gradient-to-r from-blue-500 to-purple-500" };
      default:
        return { label: "Básico", color: "bg-muted" };
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
          <Card className="p-6">
            <p className="text-center">Perfil de candidato não encontrado</p>
            <Button onClick={() => navigate("/cadastro")} className="mt-4 mx-auto block">
              Criar Perfil
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const tipoConta = getTipoConta(candidato.tipo_conta);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Cabeçalho do Perfil */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{candidato.perfis.nome_completo}</h1>
                  <p className="text-muted-foreground">Nº {candidato.numero_candidato}</p>
                  <div className="mt-2">
                    <Badge className={tipoConta.color}>
                      Conta {tipoConta.label}
                    </Badge>
                  </div>
                </div>
              </div>
              {candidato.cv_url && (
                <Button asChild>
                  <a href={candidato.cv_url} download>
                    Baixar CV
                  </a>
                </Button>
              )}
            </div>
          </Card>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{visualizacoes.length}</p>
                  <p className="text-sm text-muted-foreground">Visualizações</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Conversas</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Entrevistas</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Empresas que Visualizaram */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Empresas que Visualizaram o Teu Perfil
            </h2>
            {visualizacoes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma empresa visualizou o teu perfil ainda.
                {candidato.tipo_conta !== "pro" && (
                  <span className="block mt-2">
                    Activa a Conta Pro para aparecer imediatamente para empregadores!
                  </span>
                )}
              </p>
            ) : (
              <div className="space-y-3">
                {visualizacoes.map((viz) => (
                  <div
                    key={viz.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{viz.empregadores.nome_empresa}</p>
                      <p className="text-sm text-muted-foreground">
                        {viz.empregadores.ramo_atuacao}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(viz.visualizado_em).toLocaleDateString("pt-AO")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Informação de Privacidade */}
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-2">🔒 Privacidade e Segurança</h3>
            <p className="text-sm text-muted-foreground">
              As tuas informações pessoais estão protegidas. Os empregadores só podem ver
              os teus dados de contacto quando agendarem uma entrevista contigo.
            </p>
            <Button
              variant="link"
              className="mt-2 p-0"
              onClick={() => navigate("/privacidade")}
            >
              Ver Política de Privacidade Completa
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
