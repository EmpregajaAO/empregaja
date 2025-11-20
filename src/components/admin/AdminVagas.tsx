import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ExternalLink, MapPin, Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vaga {
  id: string;
  titulo_vaga: string;
  empresa: string;
  localidade: string;
  tipo_contrato: string;
  origem: string | null;
  salario_min: number | null;
  salario_max: number | null;
  ativa: boolean;
  data_coleta: string;
  link_origem: string;
  provincias_angola?: { nome: string } | null;
}

export function AdminVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = async () => {
    try {
      const { data, error } = await supabase
        .from("vagas")
        .select("*, provincias_angola(nome)")
        .order("data_coleta", { ascending: false })
        .limit(100);

      if (error) throw error;
      setVagas(data || []);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVagaStatus = async (vagaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("vagas")
        .update({ ativa: !currentStatus })
        .eq("id", vagaId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Vaga ${!currentStatus ? "ativada" : "desativada"} com sucesso`,
      });

      loadVagas();
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a vaga",
        variant: "destructive",
      });
    }
  };

  const formatSalario = (min: number | null, max: number | null) => {
    if (!min && !max) return "A combinar";
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} Kz`;
    if (min) return `A partir de ${min.toLocaleString()} Kz`;
    return `Até ${max?.toLocaleString()} Kz`;
  };

  if (loading) {
    return <div>A carregar vagas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestão de Vagas Agregadas</span>
          <Badge variant="secondary">{vagas.length} vagas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vagas.map((vaga) => (
                <TableRow key={vaga.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {vaga.titulo_vaga}
                  </TableCell>
                  <TableCell>{vaga.empresa}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {vaga.provincias_angola?.nome || vaga.localidade}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      {vaga.tipo_contrato}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vaga.origem ? (
                      <Badge variant="secondary">{vaga.origem}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatSalario(vaga.salario_min, vaga.salario_max)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={vaga.ativa ? "default" : "secondary"}>
                      {vaga.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={vaga.ativa ? "outline" : "default"}
                        onClick={() => toggleVagaStatus(vaga.id, vaga.ativa)}
                      >
                        {vaga.ativa ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={vaga.link_origem} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
