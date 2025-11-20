import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Building2, Clock, ExternalLink, Briefcase, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calcularDiasRestantes, formatarDiasRestantes } from "@/utils/vagasUtils";

interface Vaga {
  id: string;
  titulo_vaga: string;
  empresa: string;
  localidade: string;
  descricao: string;
  requisitos: string[];
  tipo_contrato: string;
  salario_min: number | null;
  salario_max: number | null;
  moeda: string;
  link_origem: string;
  data_publicacao_origem: string;
  data_coleta: string;
  data_expiracao: string | null;
  ativa: boolean;
  provincia: {
    nome: string;
  };
  vagas_fontes: {
    fontes_vagas: {
      nome: string;
    };
  }[];
}

const VagasAgregadas = () => {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState<string>("todas");
  const [selectedTipoContrato, setSelectedTipoContrato] = useState<string>("todos");
  const { toast } = useToast();

  useEffect(() => {
    carregarProvincias();
    carregarVagas();
  }, []);

  const carregarProvincias = async () => {
    const { data, error } = await supabase
      .from("provincias_angola")
      .select("id, nome")
      .order("nome");

    if (error) {
      console.error("Erro ao carregar províncias:", error);
    } else {
      setProvincias(data || []);
    }
  };

  const carregarVagas = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("vagas")
        .select(`
          *,
          provincia:provincias_angola(nome),
          vagas_fontes(
            fontes_vagas(nome)
          )
        `)
        .eq("ativa", true)
        .order("data_publicacao_origem", { ascending: false })
        .limit(50);

      const { data, error } = await query;

      if (error) throw error;

      setVagas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const vagasFiltradas = vagas.filter((vaga) => {
    const matchSearch = 
      vaga.titulo_vaga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchProvincia = 
      selectedProvincia === "todas" || 
      vaga.provincia?.nome === selectedProvincia;

    const matchTipo = 
      selectedTipoContrato === "todos" || 
      vaga.tipo_contrato === selectedTipoContrato;

    return matchSearch && matchProvincia && matchTipo;
  });

  const formatarData = (data: string) => {
    const date = new Date(data);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString("pt-AO");
  };

  const getDiasRestantesInfo = (dataExpiracao: string | null) => {
    const dias = calcularDiasRestantes(dataExpiracao);
    const texto = formatarDiasRestantes(dias);
    
    if (dias === null) return null;
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    if (dias < 0) variant = "destructive";
    else if (dias <= 7) variant = "destructive";
    else if (dias <= 15) variant = "secondary";
    
    return { texto, variant, dias };
  };

  const formatarSalario = (min: number | null, max: number | null, moeda: string) => {
    if (!min && !max) return null;
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${moeda}`;
    if (min) return `A partir de ${min.toLocaleString()} ${moeda}`;
    if (max) return `Até ${max.toLocaleString()} ${moeda}`;
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Vagas Agregadas</h1>
          <p className="text-muted-foreground">
            Encontre as melhores oportunidades de emprego em Angola, agregadas de múltiplas fontes
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Pesquisar vagas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2"
              />
              
              <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
                <SelectTrigger>
                  <SelectValue placeholder="Província" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Províncias</SelectItem>
                  {provincias.map((prov) => (
                    <SelectItem key={prov.id} value={prov.nome}>
                      {prov.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTipoContrato} onValueChange={setSelectedTipoContrato}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="Tempo inteiro">Tempo Inteiro</SelectItem>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Estagio">Estágio</SelectItem>
                  <SelectItem value="Temporário">Temporário</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Vagas */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">A carregar vagas...</p>
          </div>
        ) : vagasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma vaga encontrada com os filtros aplicados</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {vagasFiltradas.map((vaga) => {
              const salario = formatarSalario(vaga.salario_min, vaga.salario_max, vaga.moeda);
              
              return (
                <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{vaga.titulo_vaga}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-3 text-base">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {vaga.empresa}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {vaga.localidade}, {vaga.provincia?.nome}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{vaga.tipo_contrato}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {vaga.descricao}
                    </p>

                    {vaga.requisitos && vaga.requisitos.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Requisitos:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {vaga.requisitos.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatarData(vaga.data_publicacao_origem)}
                      </span>
                      
                      {getDiasRestantesInfo(vaga.data_expiracao) && (
                        <Badge variant={getDiasRestantesInfo(vaga.data_expiracao)!.variant} className="font-semibold">
                          {getDiasRestantesInfo(vaga.data_expiracao)!.texto}
                        </Badge>
                      )}
                      
                      {salario && (
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Briefcase className="h-4 w-4" />
                          {salario}
                        </span>
                      )}
                    </div>

                    {vaga.vagas_fontes && vaga.vagas_fontes.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Fonte: {vaga.vagas_fontes[0].fontes_vagas.nome}
                      </Badge>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/vaga/${vaga.id}`)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      
                      <Button asChild className="flex-1">
                        <a 
                          href={vaga.link_origem} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          Candidatar-se
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VagasAgregadas;
