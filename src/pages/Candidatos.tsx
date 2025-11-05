import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Users, Briefcase } from "lucide-react";

const Candidatos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1>Para Candidatos</h1>
              <p className="text-xl text-muted-foreground">
                Destaque-se no mercado de trabalho angolano com um perfil profissional completo
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Perfil Profissional</h3>
                      <p className="text-muted-foreground">Crie um perfil completo com suas qualificações e experiências</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">CV Profissional</h3>
                      <p className="text-muted-foreground">Gere automaticamente um CV em PDF pronto para enviar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Visibilidade</h3>
                      <p className="text-muted-foreground">Seja encontrado por empresas à procura de profissionais como você</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Cursos e Certificados</h3>
                      <p className="text-muted-foreground">Aceda a cursos profissionais e obtenha certificados</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 bg-card p-8 rounded-lg border">
                  <h3 className="text-2xl font-bold">Plano de Cadastro</h3>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-primary">1.000 Kz</p>
                    <p className="text-muted-foreground">Pagamento inicial único</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-accent">500 Kz/mês</p>
                    <p className="text-muted-foreground">Para manter perfil visível</p>
                  </div>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/cadastro">Começar Agora</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Candidatos;
