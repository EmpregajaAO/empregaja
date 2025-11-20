import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PaymentConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold">Obrigado pela Inscrição!</CardTitle>
            <p className="text-lg text-muted-foreground">
              Recebemos o seu comprovativo de pagamento.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          {/* Analysis Status */}
          <div className="bg-secondary/30 rounded-lg p-6 space-y-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Clock className="h-8 w-8 text-primary animate-pulse" />
              <h3 className="text-2xl font-semibold">Análise em Andamento</h3>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              O seu comprovativo está a ser analisado pela nossa equipa.
            </p>
            <div className="pt-4">
              <p className="text-lg font-medium">
                Tempo estimado de validação:
              </p>
              <p className="text-3xl font-bold text-primary pt-2">
                1 hora
              </p>
            </div>
          </div>

          {/* Warning Alert */}
          <Alert variant="destructive" className="border-2">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base font-medium ml-2">
              <strong>Aviso Importante:</strong> Se o comprovativo de pagamento for considerado falso, 
              a sua conta será imediatamente suspensa e não será possível aceder à plataforma.
            </AlertDescription>
          </Alert>

          {/* Additional Info */}
          <div className="text-center pt-4 space-y-3">
            <p className="text-muted-foreground">
              Após a validação, receberá uma notificação e o seu perfil ficará ativo.
            </p>
            <p className="text-sm text-muted-foreground">
              Agradecemos a sua paciência e compreensão.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
