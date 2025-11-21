import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Star, FileText } from "lucide-react";

const Empregadores = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleComecarRecrutar = () => {
    if (isAuthenticated) {
      navigate("/perfil-empregador");
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-subtle px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Para Empregadores</h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                Encontre os melhores talentos angolanos para a sua empresa
              </p>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
                <div className="bg-card p-5 md:p-6 rounded-lg border space-y-3 md:space-y-4 text-left">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                    <Search className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Pesquisa Avançada</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Filtre candidatos por cidade, área de atuação, experiência, formação e idade
                  </p>
                </div>
                <div className="bg-card p-5 md:p-6 rounded-lg border space-y-3 md:space-y-4 text-left">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Perfis Completos</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Aceda a CVs profissionais e perfis detalhados de candidatos qualificados
                  </p>
                </div>
                <div className="bg-card p-5 md:p-6 rounded-lg border space-y-3 md:space-y-4 text-left">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Agendamento Fácil</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Agende entrevistas diretamente através da plataforma com calendário integrado
                  </p>
                </div>
                <div className="bg-card p-5 md:p-6 rounded-lg border space-y-3 md:space-y-4 text-left">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Star className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold">Favoritos e Notas</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Marque candidatos favoritos e adicione notas para organizar seu processo de recrutamento
                  </p>
                </div>
              </div>
              <div className="pt-6 md:pt-8">
                <Button 
                  variant="hero" 
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleComecarRecrutar}
                  disabled={isLoading}
                >
                  {isAuthenticated ? "Ver Candidatos" : "Começar a Recrutar"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Empregadores;
