import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, Calendar, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Vaga {
  id: string;
  titulo_vaga: string;
  empresa: string;
  localidade: string;
  descricao: string;
  link_origem: string;
  origem: string | null;
  data_publicacao_origem: string | null;
  tipo_contrato: string;
  requisitos: string[] | null;
  salario_min: number | null;
  salario_max: number | null;
  moeda: string | null;
}

const VagaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVaga();
  }, [id]);

  const carregarVaga = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vagas")
        .select("*")
        .eq("id", id)
        .eq("ativa", true)
        .single();

      if (error) throw error;
      setVaga(data);
    } catch (error) {
      console.error("Erro ao carregar vaga:", error);
      toast.error("Erro ao carregar detalhes da vaga");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString: string | null) => {
    if (!dataString) return "Data não disponível";
    
    const data = new Date(dataString);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - data.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

  const formatarSalario = (vaga: Vaga) => {
    if (!vaga.salario_min && !vaga.salario_max) return null;
    
    const moeda = vaga.moeda || "Kz";
    if (vaga.salario_min && vaga.salario_max) {
      return `${vaga.salario_min.toLocaleString()} - ${vaga.salario_max.toLocaleString()} ${moeda}`;
    }
    if (vaga.salario_min) return `A partir de ${vaga.salario_min.toLocaleString()} ${moeda}`;
    if (vaga.salario_max) return `Até ${vaga.salario_max.toLocaleString()} ${moeda}`;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Vaga não encontrada</h1>
          <Link to="/vagas">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às vagas
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/vagas" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar às vagas
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-4">{vaga.titulo_vaga}</CardTitle>
                <div className="flex flex-wrap gap-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">{vaga.empresa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{vaga.localidade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatarData(vaga.data_publicacao_origem)}</span>
                  </div>
                </div>
              </div>
              {vaga.origem && (
                <Badge variant="secondary" className="ml-4">
                  {vaga.origem}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div>
              <Badge>{vaga.tipo_contrato}</Badge>
              {formatarSalario(vaga) && (
                <Badge variant="outline" className="ml-2">
                  {formatarSalario(vaga)}
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Descrição da Vaga</h3>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {vaga.descricao}
              </p>
            </div>

            {vaga.requisitos && vaga.requisitos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Requisitos</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {vaga.requisitos.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t">
              <a
                href={vaga.link_origem}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button size="lg" className="w-full">
                  Candidatar-se
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VagaDetalhes;
