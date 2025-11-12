import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminNotificacoes() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    tipo: "geral",
    destinatarios: "todos",
  });

  const enviarNotificacao = async () => {
    if (!formData.titulo || !formData.mensagem) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      // Buscar destinatários baseado na seleção
      let userIds: string[] = [];

      if (formData.destinatarios === "todos") {
        const { data: users } = await supabase.auth.admin.listUsers();
        userIds = users.users.map(u => u.id);
      } else if (formData.destinatarios === "candidatos") {
        const { data } = await supabase
          .from("perfis")
          .select("user_id")
          .eq("tipo_utilizador", "candidato");
        userIds = data?.map(p => p.user_id) || [];
      } else if (formData.destinatarios === "empregadores") {
        const { data } = await supabase
          .from("perfis")
          .select("user_id")
          .eq("tipo_utilizador", "empregador");
        userIds = data?.map(p => p.user_id) || [];
      }

      // Criar notificações para cada usuário
      const notificacoes = userIds.map(userId => ({
        user_id: userId,
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        tipo: formData.tipo,
        lida: false,
      }));

      const { error } = await supabase
        .from("notificacoes_push")
        .insert(notificacoes);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${notificacoes.length} notificações enviadas com sucesso`,
      });

      // Limpar formulário
      setFormData({
        titulo: "",
        mensagem: "",
        tipo: "geral",
        destinatarios: "todos",
      });
    } catch (error) {
      console.error("Erro ao enviar notificações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar as notificações",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Enviar Notificações Push
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-w-2xl">
          <div>
            <Label htmlFor="destinatarios">Destinatários</Label>
            <Select
              value={formData.destinatarios}
              onValueChange={(v) => setFormData({ ...formData, destinatarios: v })}
            >
              <SelectTrigger id="destinatarios">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Utilizadores</SelectItem>
                <SelectItem value="candidatos">Apenas Candidatos</SelectItem>
                <SelectItem value="empregadores">Apenas Empregadores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Notificação</Label>
            <Select
              value={formData.tipo}
              onValueChange={(v) => setFormData({ ...formData, tipo: v })}
            >
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="pagamento">Pagamento</SelectItem>
                <SelectItem value="entrevista">Entrevista</SelectItem>
                <SelectItem value="mensagem">Mensagem</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="titulo">Título da Notificação</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Nova funcionalidade disponível"
            />
          </div>

          <div>
            <Label htmlFor="mensagem">Mensagem</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              placeholder="Digite a mensagem da notificação..."
              rows={5}
            />
          </div>

          <Button
            onClick={enviarNotificacao}
            disabled={sending}
            className="w-full gap-2"
          >
            <Send className="h-4 w-4" />
            {sending ? "A enviar..." : "Enviar Notificação"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}