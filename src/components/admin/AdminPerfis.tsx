import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Perfil {
  id: string;
  nome_completo: string;
  telefone: string;
  tipo_utilizador: string;
  status_validacao: string;
  created_at: string;
}

export function AdminPerfis() {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfilToDelete, setPerfilToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPerfis();
  }, []);

  const loadPerfis = async () => {
    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPerfis(data || []);
    } catch (error) {
      console.error("Erro ao carregar perfis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os perfis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validarPerfil = async (perfilId: string, status: "aprovado" | "rejeitado") => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Buscar dados do perfil antes de atualizar
      const { data: perfilData } = await supabase
        .from("perfis")
        .select(`
          user_id, 
          nome_completo, 
          tipo_utilizador,
          candidatos(id),
          empregadores(id)
        `)
        .eq("id", perfilId)
        .single();

      if (!perfilData) {
        toast({
          title: "Erro",
          description: "Perfil não encontrado",
          variant: "destructive",
        });
        return;
      }

      // Buscar email do usuário
      const { data, error: usersError } = await supabase.auth.admin.listUsers();
      const userEmail = data?.users?.find((u: any) => u.id === perfilData.user_id)?.email;

      if (usersError) {
        console.error("Erro ao buscar email:", usersError);
      }

      // Atualizar perfil
      const { error } = await supabase
        .from("perfis")
        .update({
          status_validacao: status,
          data_validacao: new Date().toISOString(),
          validado_por: user?.id,
        })
        .eq("id", perfilId);

      if (error) throw error;

      // Se aprovado, atualizar também o pagamento pendente se existir
      if (status === "aprovado" && perfilData.candidatos?.[0]?.id) {
        const candidatoId = perfilData.candidatos[0].id;
        
        // Buscar pagamento pendente do candidato
        const { data: pagamentoPendente } = await supabase
          .from("comprovativos_pagamento")
          .select("id, tipo_servico")
          .eq("candidato_id", candidatoId)
          .eq("status", "pendente")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Se existir pagamento pendente, aprovar automaticamente
        if (pagamentoPendente) {
          await supabase
            .from("comprovativos_pagamento")
            .update({ 
              status: "aprovado",
              observacoes: "Pagamento aprovado automaticamente ao validar perfil"
            })
            .eq("id", pagamentoPendente.id);

          // Liberar acesso baseado no tipo de serviço
          if (pagamentoPendente.tipo_servico === "conta_ativa") {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1);
            
            await supabase
              .from("candidatos")
              .update({
                tipo_conta: "ativo",
                data_expiracao_conta: expirationDate.toISOString(),
              })
              .eq("id", candidatoId);
          } else if (pagamentoPendente.tipo_servico === "conta_pro") {
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            
            await supabase
              .from("candidatos")
              .update({
                tipo_conta: "pro",
                data_expiracao_conta: expirationDate.toISOString(),
              })
              .eq("id", candidatoId);
          }

          console.log("Pagamento aprovado automaticamente:", pagamentoPendente.id);
        }
      }

      // Enviar notificação
      if (userEmail) {
        const tipoNotificacao = perfilData.tipo_utilizador === "empregador" 
          ? (status === "aprovado" ? "aprovacao_empregador" : "rejeicao_empregador")
          : (status === "aprovado" ? "aprovacao_perfil" : "rejeicao_perfil");

        supabase.functions.invoke("enviar-notificacao", {
          body: {
            user_id: perfilData.user_id,
            email: userEmail,
            nome: perfilData.nome_completo,
            tipo: tipoNotificacao,
          },
        }).catch(err => console.error("Erro ao enviar notificação:", err));
      }

      toast({
        title: "Sucesso",
        description: `Perfil ${status === "aprovado" ? "aprovado" : "rejeitado"} com sucesso${status === "aprovado" ? ". Pagamento também foi validado automaticamente." : ""}`,
      });

      loadPerfis();
    } catch (error) {
      console.error("Erro ao validar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível validar o perfil",
        variant: "destructive",
      });
    }
  };

  const eliminarPerfil = async (perfilId: string) => {
    try {
      // Buscar dados do perfil
      const { data: perfilData } = await supabase
        .from("perfis")
        .select(`
          user_id,
          candidatos(id, cv_url),
          empregadores(id)
        `)
        .eq("id", perfilId)
        .single();

      if (!perfilData) {
        toast({
          title: "Erro",
          description: "Perfil não encontrado",
          variant: "destructive",
        });
        return;
      }

      // Eliminar registros relacionados (candidato ou empregador)
      if (perfilData.candidatos?.[0]) {
        const candidatoId = perfilData.candidatos[0].id;
        
        // Eliminar comprovativos
        await supabase
          .from("comprovativos_pagamento")
          .delete()
          .eq("candidato_id", candidatoId);

        // Eliminar matrículas
        await supabase
          .from("course_enrollments")
          .delete()
          .eq("candidato_id", candidatoId);

        // Eliminar candidato
        await supabase
          .from("candidatos")
          .delete()
          .eq("id", candidatoId);
      }

      if (perfilData.empregadores?.[0]) {
        const empregadorId = perfilData.empregadores[0].id;
        
        // Eliminar chats
        await supabase
          .from("chats")
          .delete()
          .eq("empregador_id", empregadorId);

        // Eliminar empregador
        await supabase
          .from("empregadores")
          .delete()
          .eq("id", empregadorId);
      }

      // Eliminar perfil
      const { error: perfilError } = await supabase
        .from("perfis")
        .delete()
        .eq("id", perfilId);

      if (perfilError) throw perfilError;

      // Tentar eliminar usuário do auth (requer privilégios de admin)
      try {
        await supabase.auth.admin.deleteUser(perfilData.user_id);
      } catch (authError) {
        console.error("Erro ao eliminar usuário do auth:", authError);
      }

      toast({
        title: "Sucesso",
        description: "Perfil eliminado com sucesso",
      });

      loadPerfis();
      setPerfilToDelete(null);
    } catch (error) {
      console.error("Erro ao eliminar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o perfil",
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
    return <div>A carregar perfis...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Perfis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Registo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perfis.map((perfil) => (
              <TableRow key={perfil.id}>
                <TableCell className="font-medium">{perfil.nome_completo}</TableCell>
                <TableCell>{perfil.telefone || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{perfil.tipo_utilizador}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(perfil.status_validacao)}</TableCell>
                <TableCell>
                  {new Date(perfil.created_at).toLocaleDateString("pt-AO")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {perfil.status_validacao === "pendente" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => validarPerfil(perfil.id, "aprovado")}
                          className="gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => validarPerfil(perfil.id, "rejeitado")}
                          className="gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPerfilToDelete(perfil.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={!!perfilToDelete} onOpenChange={() => setPerfilToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Eliminação
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar este perfil? Esta ação é irreversível e irá:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Eliminar o perfil do utilizador</li>
                <li>Eliminar todos os pagamentos associados</li>
                <li>Eliminar todas as matrículas em cursos</li>
                <li>Eliminar todos os chats (se empregador)</li>
                <li>Tentar eliminar a conta de autenticação</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => perfilToDelete && eliminarPerfil(perfilToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Perfil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}