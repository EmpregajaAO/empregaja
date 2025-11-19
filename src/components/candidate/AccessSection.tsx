import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Building2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccessSectionProps {
  visualizacoes: any[];
}

export default function AccessSection({ visualizacoes }: AccessSectionProps) {
  const totalVisits = visualizacoes.length;
  const recentVisits = visualizacoes.slice(0, 5);
  
  // Calculate visits this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const visitsThisWeek = visualizacoes.filter(
    v => new Date(v.visualizado_em) > oneWeekAgo
  ).length;

  return (
    <Card className="p-6 bg-panel-access/30 border-panel-access-foreground/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-panel-access rounded-lg">
          <Eye className="w-6 h-6 text-panel-access-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Quem Visitou Meu Perfil</h2>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total de Visitas</span>
            <Eye className="w-4 h-4 text-panel-access-foreground" />
          </div>
          <p className="text-2xl font-bold">{totalVisits}</p>
        </div>

        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Esta Semana</span>
            <TrendingUp className="w-4 h-4 text-panel-access-foreground" />
          </div>
          <p className="text-2xl font-bold">{visitsThisWeek}</p>
        </div>

        <div className="p-4 bg-card rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Visitas Recentes</span>
            <Calendar className="w-4 h-4 text-panel-access-foreground" />
          </div>
          <p className="text-2xl font-bold">{recentVisits.length}</p>
        </div>
      </div>

      {/* Recent Visits List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg mb-3">Visitas Recentes</h3>
        
        {recentVisits.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma visita registrada ainda. Continue aprimorando seu perfil!
          </p>
        ) : (
          recentVisits.map((visualizacao) => (
            <div
              key={visualizacao.id}
              className="p-4 bg-card rounded-lg border hover:border-panel-access-foreground/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-panel-access rounded-lg">
                    <Building2 className="w-5 h-5 text-panel-access-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{visualizacao.empregadores?.nome_empresa}</p>
                    <p className="text-sm text-muted-foreground">
                      {visualizacao.empregadores?.ramo_atuacao}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(visualizacao.visualizado_em), "dd MMM, HH:mm", { locale: ptBR })}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {visualizacoes.length > 5 && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Mostrando as 5 visitas mais recentes de {totalVisits} no total
        </p>
      )}
    </Card>
  );
}
