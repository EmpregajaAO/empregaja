import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock } from "lucide-react";
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
        .select("user_id, nome_completo, tipo_utilizador")
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

      // Buscar email do usuário através do admin API
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

      // Enviar notificação se tiver email
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
        description: `Perfil ${status === "aprovado" ? "aprovado" : "rejeitado"} com sucesso`,
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
                  {perfil.status_validacao === "pendente" && (
                    <div className="flex gap-2">
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
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}