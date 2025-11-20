import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Vagas = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const vagas = [
    { title: "Gestor de Vendas", company: "Empresa ABC", location: "Luanda", type: "Tempo Integral", date: "Há 2 dias" },
    { title: "Desenvolvedor Web", company: "Tech Solutions", location: "Luanda", type: "Tempo Integral", date: "Há 3 dias" },
    { title: "Assistente Administrativo", company: "XYZ Lda", location: "Benguela", type: "Tempo Integral", date: "Há 5 dias" },
    { title: "Gestor de Marketing", company: "Marketing Plus", location: "Luanda", type: "Tempo Integral", date: "Há 1 semana" },
    { title: "Contador Sênior", company: "FinanceGroup", location: "Huambo", type: "Tempo Integral", date: "Há 1 semana" },
    { title: "Designer Gráfico", company: "Creative Studio", location: "Luanda", type: "Freelancer", date: "Há 2 semanas" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
              <h1>Vagas Disponíveis</h1>
              <p className="text-xl text-muted-foreground">
                Oportunidades de emprego atualizadas diariamente de empresas em todo Angola
              </p>
            </div>

            {!loading && !isAuthenticated && (
              <Alert className="max-w-4xl mx-auto mb-8 border-primary/50 bg-primary/5">
                <Lock className="h-5 w-5 text-primary" />
                <AlertTitle className="text-lg font-semibold">Acesso Restrito</AlertTitle>
                <AlertDescription className="mt-2 space-y-3">
                  <p className="text-base">
                    As vagas de emprego estão disponíveis apenas para utilizadores registados. 
                    Faça login ou crie uma conta gratuita para visualizar todas as oportunidades.
                  </p>
                  <Button 
                    onClick={() => navigate("/cadastro")}
                    className="w-full sm:w-auto"
                  >
                    Fazer Login / Registar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="max-w-4xl mx-auto space-y-4">
              {isAuthenticated ? (
                vagas.map((vaga, index) => (
                  <Card key={index} className="hover:shadow-medium transition-shadow cursor-pointer">
                    <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{vaga.title}</CardTitle>
                        <CardDescription className="text-base font-medium text-foreground/70">
                          {vaga.company}
                        </CardDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {vaga.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {vaga.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {vaga.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
              ) : (
                !loading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Lock className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">Faça login para visualizar as vagas disponíveis</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Vagas;
