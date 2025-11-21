import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Check, Smartphone, Zap, Globe, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Instalar = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful installation
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      toast({
        title: "Aplicativo Instalado!",
        description: "EmpregaJá foi adicionado à tela inicial do seu dispositivo.",
      });
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Não disponível",
        description: "A instalação não está disponível neste momento. Tente usar o menu do navegador.",
        variant: "destructive",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast({
        title: "Instalando...",
        description: "O aplicativo está sendo instalado no seu dispositivo.",
      });
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: Zap,
      title: "Acesso Rápido",
      description: "Abra o app direto da tela inicial, sem precisar do navegador"
    },
    {
      icon: Globe,
      title: "Funciona Offline",
      description: "Use o app mesmo sem conexão à internet"
    },
    {
      icon: Lock,
      title: "Seguro e Confiável",
      description: "Seus dados estão protegidos e sincronizados"
    },
    {
      icon: Smartphone,
      title: "Experiência Nativa",
      description: "Interface otimizada como um app de verdade"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-16 lg:py-20 px-4 bg-gradient-subtle">
        <div className="container max-w-4xl mx-auto">
          {isInstalled ? (
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">Aplicativo Já Instalado!</CardTitle>
                <CardDescription className="text-base md:text-lg mt-2">
                  O EmpregaJá já está instalado no seu dispositivo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/")} variant="hero" size="lg" className="w-full sm:w-auto">
                  Ir para o Início
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-8 md:mb-12 space-y-4">
                <div className="mx-auto mb-6 h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Download className="h-10 w-10 md:h-12 md:w-12 text-primary-foreground" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Instale o EmpregaJá</h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                  Adicione o EmpregaJá à tela inicial do seu celular e tenha acesso rápido a todas as funcionalidades
                </p>
              </div>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  {isInstallable ? (
                    <div className="text-center space-y-4">
                      <p className="text-lg font-medium">
                        Toque no botão abaixo para instalar o aplicativo
                      </p>
                      <Button 
                        onClick={handleInstallClick}
                        variant="hero"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Instalar Aplicativo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="font-semibold text-center mb-4">
                        Como instalar no seu dispositivo:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium mb-2">📱 iPhone / iPad (Safari):</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Toque no botão de compartilhar (📤)</li>
                            <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                            <li>Toque em "Adicionar"</li>
                          </ol>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium mb-2">🤖 Android (Chrome):</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Toque no menu (⋮) no canto superior direito</li>
                            <li>Toque em "Adicionar à tela inicial"</li>
                            <li>Toque em "Adicionar"</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3">
                        <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instalar;
