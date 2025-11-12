import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, UserCheck, FileText, TrendingUp, Calendar } from "lucide-react";

interface DashboardStats {
  totalCandidatos: number;
  totalEmpregadores: number;
  totalPagamentos: number;
  receitaMensal: number;
  receitaTotal: number;
  candidatosPro: number;
  perfisPendentes: number;
  renovacoesMes: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidatos: 0,
    totalEmpregadores: 0,
    totalPagamentos: 0,
    receitaMensal: 0,
    receitaTotal: 0,
    candidatosPro: 0,
    perfisPendentes: 0,
    renovacoesMes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Total de candidatos
      const { count: candidatosCount } = await supabase
        .from("candidatos")
        .select("*", { count: "exact", head: true });

      // Total de empregadores
      const { count: empregadoresCount } = await supabase
        .from("empregadores")
        .select("*", { count: "exact", head: true });

      // Candidatos Pro
      const { count: proCount } = await supabase
        .from("candidatos")
        .select("*", { count: "exact", head: true })
        .eq("tipo_conta", "pro");

      // Perfis pendentes de validação
      const { count: pendentesCount } = await supabase
        .from("perfis")
        .select("*", { count: "exact", head: true })
        .eq("status_validacao", "pendente");

      // Pagamentos e receita
      const { data: pagamentos } = await supabase
        .from("comprovativos_pagamento")
        .select("valor, status, created_at")
        .eq("status", "aprovado");

      const receitaTotal = pagamentos?.reduce((sum, p) => sum + Number(p.valor), 0) || 0;
      
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      const receitaMensal = pagamentos?.filter(p => {
        const data = new Date(p.created_at);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      }).reduce((sum, p) => sum + Number(p.valor), 0) || 0;

      // Renovações do mês (contas que expiraram ou vão expirar este mês)
      const inicioMes = new Date(anoAtual, mesAtual, 1);
      const fimMes = new Date(anoAtual, mesAtual + 1, 0);
      
      const { count: renovacoesCount } = await supabase
        .from("candidatos")
        .select("*", { count: "exact", head: true })
        .gte("data_expiracao_conta", inicioMes.toISOString())
        .lte("data_expiracao_conta", fimMes.toISOString());

      setStats({
        totalCandidatos: candidatosCount || 0,
        totalEmpregadores: empregadoresCount || 0,
        totalPagamentos: pagamentos?.length || 0,
        receitaMensal,
        receitaTotal,
        candidatosPro: proCount || 0,
        perfisPendentes: pendentesCount || 0,
        renovacoesMes: renovacoesCount || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>A carregar estatísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidatos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.candidatosPro} contas Pro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empregadores</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmpregadores}</div>
            <p className="text-xs text-muted-foreground">Empresas registadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.receitaMensal.toLocaleString('pt-AO')} Kz</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPagamentos} pagamentos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.receitaTotal.toLocaleString('pt-AO')} Kz</div>
            <p className="text-xs text-muted-foreground">Acumulado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfis Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.perfisPendentes}</div>
            <p className="text-xs text-muted-foreground">A aguardar validação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renovações do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.renovacoesMes}</div>
            <p className="text-xs text-muted-foreground">Contas a expirar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}