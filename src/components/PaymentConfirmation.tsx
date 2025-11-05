import { CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentConfirmation = () => {
  const whatsappNumber = "921346544";
  const iban = "AO06 0000 0000 0000 0000 0000 0";

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de enviar o comprovativo de pagamento do meu cadastro na EmpregaJá.");
    window.open(`https://wa.me/244${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
          </div>
          <CardTitle className="text-3xl">Perfil Criado com Sucesso!</CardTitle>
          <CardDescription className="text-base">
            O seu perfil foi criado. Para que fique visível aos empregadores, é necessário efetuar o pagamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Information */}
          <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">Informação de Pagamento</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Valor:</span>
                <span className="text-2xl font-bold text-primary">1.000 Kz</span>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-sm text-muted-foreground">IBAN para transferência:</span>
                <code className="bg-background px-3 py-2 rounded border text-sm font-mono">
                  {iban}
                </code>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold">Como Proceder:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Efetue a transferência bancária de 1.000 Kz para o IBAN acima</li>
              <li>Tire uma foto ou screenshot do comprovativo de pagamento</li>
              <li>Envie o comprovativo através de uma das opções abaixo</li>
              <li>Aguarde a confirmação (até 24 horas)</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3 pt-4">
            <Button
              size="lg"
              className="w-full gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={handleWhatsApp}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar via WhatsApp: {whatsappNumber}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
            >
              <MessageSquare className="h-5 w-5" />
              Enviar via Chat da Plataforma
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Após a confirmação do pagamento, o seu perfil ficará visível aos empregadores.</p>
            <p className="pt-2">Taxa mensal de manutenção: <strong>500 Kz/mês</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;
