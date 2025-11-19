import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/employer/DashboardStats";
import CandidateFilters from "@/components/employer/CandidateFilters";
import CandidateCard from "@/components/employer/CandidateCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Empregador {
  id: string;
  nome_empresa: string;
  ramo_atuacao: string;
}

interface Candidato {
  id: string;
  numero_candidato: string;
  tipo_conta: 'basico' | 'ativo' | 'pro';
  perfil_id: string;
  perfis: {
    nome_completo: string;
    telefone: string | null;
  };
}

const PerfilEmpregador = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [empregador, setEmpregador] = useState<Empregador | null>(null);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [filteredCandidatos, setFilteredCandidatos] = useState<Candidato[]>([]);

  useEffect(() => {
    loadEmpregadorData();
  }, []);

  const loadEmpregadorData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/cadastro");
        return;
      }

      // Buscar dados do empregador
      const { data: perfilData } = await supabase
        .from("perfis")
        .select("id")
        .eq("user_id", user.id)
        .eq("tipo_utilizador", "empregador")
        .single();

      if (!perfilData) {
        toast.error("Perfil de empregador não encontrado");
        navigate("/cadastro");
        return;
      }

      const { data: empregadorData } = await supabase
        .from("empregadores")
        .select("*")
        .eq("perfil_id", perfilData.id)
        .single();

      if (empregadorData) {
        setEmpregador(empregadorData);
      }

      // Buscar candidatos Pro (recomendados) primeiro
      const { data: candidatosData } = await supabase
        .from("candidatos")
        .select(`
          id,
          numero_candidato,
          tipo_conta,
          perfil_id,
          perfis (
            nome_completo,
            telefone
          )
        `)
        .eq("tipo_conta", "pro")
        .order("created_at", { ascending: false });

      if (candidatosData) {
        setCandidatos(candidatosData as Candidato[]);
        setFilteredCandidatos(candidatosData as Candidato[]);
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do painel");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: any) => {
    // Implementar lógica de filtro aqui
    console.log("Filtros aplicados:", filters);
    // Por enquanto, apenas mantém os candidatos atuais
    setFilteredCandidatos(candidatos);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!empregador) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Empregador não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Mensagem de incentivo */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8 border border-border">
          <p className="text-sm text-muted-foreground">
            Use este painel para encontrar rapidamente os melhores candidatos. 
            Perfis recomendados aparecem primeiro e são selecionados por nossa equipe 
            para aumentar suas chances de sucesso nas contratações. Suas informações 
            são mantidas seguras até você decidir interagir.
          </p>
        </div>

        {/* Bem-vindo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {empregador.nome_empresa}
          </h1>
          <p className="text-muted-foreground">
            Ramo de Atuação: {empregador.ramo_atuacao}
          </p>
        </div>

        {/* Estatísticas */}
        <DashboardStats empregadorId={empregador.id} />

        {/* Filtros */}
        <div className="mb-8">
          <CandidateFilters onFilter={handleFilter} />
        </div>

        {/* Lista de Candidatos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Candidatos Recomendados</h2>
          
          {filteredCandidatos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum candidato recomendado encontrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidatos.map((candidato) => (
                <CandidateCard
                  key={candidato.id}
                  candidato={candidato}
                  empregadorId={empregador.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PerfilEmpregador;
