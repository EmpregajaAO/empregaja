import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, ExternalLink, BookOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Comprovativo {
  id: string;
  valor: number;
  tipo_servico: string;
  status: string;
  comprovativo_url: string;
  observacoes: string | null;
  created_at: string;
  candidatos: {
    perfis: {
      nome_completo: string;
      telefone: string;
    };
  };
}

export function AdminCursos() {
  const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadComprovativos();
  }, []);

  const loadComprovativos = async () => {
    try {
      const { data, error } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          *,
          candidatos(
            perfis(nome_completo, telefone)
          )
        `)
        .eq("tipo_servico", "curso")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComprovativos(data || []);
    } catch (error) {
      console.error("Erro ao carregar comprovativos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comprovativos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const aprovarPagamento = async (comprovantivoId: string) => {
    try {
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ status: "aprovado" })
        .eq("id", comprovantivoId);

      if (error) throw error;

      // Atualizar matrícula do curso
      const { error: enrollmentError } = await supabase
        .from("course_enrollments")
        .update({ payment_verified: true })
        .eq("comprovativo_id", comprovantivoId);

      if (enrollmentError) throw enrollmentError;

      toast({
        title: "Sucesso",
        description: "Pagamento aprovado com sucesso",
      });

      loadComprovativos();
    } catch (error) {
      console.error("Erro ao aprovar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o pagamento",
        variant: "destructive",
      });
    }
  };

  const rejeitarPagamento = async (comprovantivoId: string) => {
    try {
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ status: "rejeitado" })
        .eq("id", comprovantivoId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pagamento rejeitado",
      });

      loadComprovativos();
    } catch (error) {
      console.error("Erro ao rejeitar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "aprovado":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Aprovado</Badge>;
      case "rejeitado":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div>A carregar comprovativos...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Aprovação de Pagamentos de Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Comprovativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comprovativos.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell className="font-medium">
                      {comp.candidatos?.perfis?.nome_completo || "N/A"}
                    </TableCell>
                    <TableCell>
                      {comp.candidatos?.perfis?.telefone || "N/A"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {comp.valor.toLocaleString()} Kz
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(comp.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(comp.created_at).toLocaleDateString('pt-AO')}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedImage(comp.comprovativo_url)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {comp.status === "pendente" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => aprovarPagamento(comp.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejeitarPagamento(comp.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Comprovativo de Pagamento</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Comprovativo" 
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
