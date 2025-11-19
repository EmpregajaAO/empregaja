import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BadgeCheck } from "lucide-react";

interface WelcomeSectionProps {
  nome: string;
  tipoConta: string;
  statusPagamento: string;
}

export default function WelcomeSection({ nome, tipoConta, statusPagamento }: WelcomeSectionProps) {
  const getTipoContaConfig = (tipo: string) => {
    if (tipo === "pro") {
      return {
        label: "Perfil Prêmio",
        badge: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
        icon: <BadgeCheck className="w-5 h-5" />
      };
    }
    return {
      label: "Perfil Normal",
      badge: "bg-muted text-muted-foreground",
      icon: null
    };
  };

  const config = getTipoContaConfig(tipoConta);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo, {nome}!</h1>
          <p className="text-muted-foreground">
            Mantenha seu painel atualizado e completo para aumentar sua visibilidade.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Badge className={`${config.badge} flex items-center gap-2 px-4 py-2 text-sm`}>
            {config.icon}
            {config.label}
          </Badge>
          
          <Badge 
            variant={statusPagamento === "aprovado" ? "default" : "secondary"}
            className="flex items-center gap-2 px-4 py-2"
          >
            {statusPagamento === "aprovado" ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Pagamento Confirmado
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Pagamento Pendente
              </>
            )}
          </Badge>
        </div>
      </div>
      
      {tipoConta === "pro" && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" />
            Este perfil é recomendado pelos nossos especialistas para aumentar sua visibilidade.
          </p>
        </div>
      )}
    </Card>
  );
}
