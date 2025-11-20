import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, ExternalLink, Eye } from "lucide-react";
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

export function AdminComprovativos() {
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

  const aprovarPagamento = async (comprovantivoId: string, tipoServico: string) => {
    try {
      // Buscar dados do comprovativo antes de aprovar
      const { data: comprovantivoData } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          candidato_id,
          candidatos (
            perfil_id,
            perfis (
              user_id,
              nome_completo
            )
          )
        `)
        .eq("id", comprovantivoId)
        .single();

      if (!comprovantivoData) {
        toast({
          title: "Erro",
          description: "Comprovativo não encontrado",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ status: "aprovado" })
        .eq("id", comprovantivoId);

      if (error) throw error;

      // Se for curso, atualizar matrícula
      if (tipoServico === "curso") {
        const { error: enrollmentError } = await supabase
          .from("course_enrollments")
          .update({ payment_verified: true })
          .eq("comprovativo_id", comprovantivoId);

        if (enrollmentError) throw enrollmentError;
      }

      // Se for conta pro, atualizar tipo de conta do candidato
      if (tipoServico === "conta_pro") {
        const { data: comprovativo } = await supabase
          .from("comprovativos_pagamento")
          .select("candidato_id")
          .eq("id", comprovantivoId)
          .single();

        if (comprovativo) {
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          await supabase
            .from("candidatos")
            .update({
              tipo_conta: "pro",
              data_expiracao_conta: expirationDate.toISOString(),
            })
            .eq("id", comprovativo.candidato_id);
        }
      }

      // Enviar notificação
      const perfil = (comprovantivoData as any).candidatos?.perfis;
      if (perfil) {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        const userEmail = data?.users?.find((u: any) => u.id === perfil.user_id)?.email;

        if (userEmail) {
          const tipoNotificacao = tipoServico === "curso" 
            ? "aprovacao_curso" 
            : "aprovacao_conta_pro";

          supabase.functions.invoke("enviar-notificacao", {
            body: {
              user_id: perfil.user_id,
              email: userEmail,
              nome: perfil.nome_completo,
              tipo: tipoNotificacao,
            },
          }).catch(err => console.error("Erro ao enviar notificação:", err));
        }
      }

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

  const rejeitarPagamento = async (comprovantivoId: string, tipoServico: string) => {
    try {
      // Buscar dados do comprovativo antes de rejeitar
      const { data: comprovantivoData } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          candidato_id,
          candidatos (
            perfil_id,
            perfis (
              user_id,
              nome_completo
            )
          )
        `)
        .eq("id", comprovantivoId)
        .single();

      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ status: "rejeitado" })
        .eq("id", comprovantivoId);

      if (error) throw error;

      // Enviar notificação
      if (comprovantivoData) {
        const perfil = (comprovantivoData as any).candidatos?.perfis;
        if (perfil) {
          const { data, error: usersError } = await supabase.auth.admin.listUsers();
          const userEmail = data?.users?.find((u: any) => u.id === perfil.user_id)?.email;

          if (userEmail) {
            const tipoNotificacao = tipoServico === "curso" 
              ? "rejeicao_curso" 
              : "rejeicao_perfil";

            supabase.functions.invoke("enviar-notificacao", {
              body: {
                user_id: perfil.user_id,
                email: userEmail,
                nome: perfil.nome_completo,
                tipo: tipoNotificacao,
                detalhes: "Por favor, verifique o comprovativo e envie novamente.",
              },
            }).catch(err => console.error("Erro ao enviar notificação:", err));
          }
        }
      }

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

  const getTipoServicoBadge = (tipo: string) => {
    switch (tipo) {
      case "curso":
        return <Badge variant="secondary">Curso</Badge>;
      case "conta_pro":
        return <Badge variant="secondary">Conta Pro</Badge>;
      default:
        return <Badge variant="secondary">{tipo}</Badge>;
    }
  };

  if (loading) {
    return <div>A carregar comprovativos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Comprovativos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidato</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo Serviço</TableHead>
              <TableHead>Valor (Kz)</TableHead>
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
                  {comp.candidatos.perfis.nome_completo}
                </TableCell>
                <TableCell>{comp.candidatos.perfis.telefone || "N/A"}</TableCell>
                <TableCell>{getTipoServicoBadge(comp.tipo_servico)}</TableCell>
                <TableCell>{comp.valor.toLocaleString("pt-AO")}</TableCell>
                <TableCell>{getStatusBadge(comp.status)}</TableCell>
                <TableCell>
                  {new Date(comp.created_at).toLocaleDateString("pt-AO")}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedImage(comp.comprovativo_url)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </Button>
                </TableCell>
                <TableCell>
                  {comp.status === "pendente" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => aprovarPagamento(comp.id, comp.tipo_servico)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejeitarPagamento(comp.id, comp.tipo_servico)}
                        className="gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Comprovativo de Pagamento</DialogTitle>
            </DialogHeader>
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Comprovativo"
                  className="w-full rounded-lg"
                />
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => window.open(selectedImage, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em Nova Aba
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
