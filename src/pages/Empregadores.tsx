import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Calendar, Star, FileText } from "lucide-react";

const Empregadores = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1>Para Empregadores</h1>
              <p className="text-xl text-muted-foreground">
                Encontre os melhores talentos angolanos para a sua empresa
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <div className="bg-card p-6 rounded-lg border space-y-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Pesquisa Avançada</h3>
                  <p className="text-muted-foreground">
                    Filtre candidatos por cidade, área de atuação, experiência, formação e idade
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border space-y-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Perfis Completos</h3>
                  <p className="text-muted-foreground">
                    Aceda a CVs profissionais e perfis detalhados de candidatos qualificados
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border space-y-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Agendamento Fácil</h3>
                  <p className="text-muted-foreground">
                    Agende entrevistas diretamente através da plataforma com calendário integrado
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border space-y-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Star className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">Favoritos e Notas</h3>
                  <p className="text-muted-foreground">
                    Marque candidatos favoritos e adicione notas para organizar seu processo de recrutamento
                  </p>
                </div>
              </div>
              <div className="pt-8">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/cadastro">Começar a Recrutar</Link>
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
