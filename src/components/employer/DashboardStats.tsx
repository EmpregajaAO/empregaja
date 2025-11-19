import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Calendar, MessageSquare } from "lucide-react";

interface DashboardStatsProps {
  empregadorId: string;
}

const DashboardStats = ({ empregadorId }: DashboardStatsProps) => {
  const [stats, setStats] = useState({
    visualizacoes: 0,
    entrevistas: 0,
    mensagens: 0,
  });

  useEffect(() => {
    loadStats();
  }, [empregadorId]);

  const loadStats = async () => {
    try {
      // Contar visualizações de perfil
      const { count: visualizacoesCount } = await supabase
        .from("visualizacoes_perfil")
        .select("*", { count: "exact", head: true })
        .eq("empregador_id", empregadorId);

      // Contar entrevistas agendadas
      const { count: entrevistasCount } = await supabase
        .from("entrevistas")
        .select("*", { count: "exact", head: true })
        .eq("empregador_id", empregadorId);

      // Contar chats ativos
      const { count: mensagensCount } = await supabase
        .from("chats")
        .select("*", { count: "exact", head: true })
        .eq("empregador_id", empregadorId);

      setStats({
        visualizacoes: visualizacoesCount || 0,
        entrevistas: entrevistasCount || 0,
        mensagens: mensagensCount || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Perfis Visualizados
          </CardTitle>
          <Eye className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.visualizacoes}</div>
          <p className="text-xs text-muted-foreground">
            Total de visualizações
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Entrevistas Agendadas
          </CardTitle>
          <Calendar className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.entrevistas}</div>
          <p className="text-xs text-muted-foreground">
            Agendamentos ativos
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Mensagens Recebidas
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mensagens}</div>
          <p className="text-xs text-muted-foreground">
            Conversas ativas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
