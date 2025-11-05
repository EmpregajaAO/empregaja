import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeModal from "@/components/WelcomeModal";
import { ArrowRight, CheckCircle2, Briefcase, GraduationCap, Users, FileText } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import coursesPlaceholder from "@/assets/courses-placeholder.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeModal />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-foreground">
                  Mostre o seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">talento</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Crie seu perfil profissional, gere seu CV automaticamente e seja encontrado pelas melhores empresas de Angola.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/cadastro">
                      Criar Perfil Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <Link to="/sobre">Saiba Mais</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
                <img
                  src={heroImage}
                  alt="Profissionais angolanos em ambiente de trabalho moderno"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-foreground">Como Funciona</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Apenas 3 passos simples para começar sua jornada profissional
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-all hover:shadow-medium">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>1. Cadastre seu perfil</CardTitle>
                  <CardDescription>
                    Preencha suas informações pessoais, formação acadêmica e experiência profissional de forma simples e rápida.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-all hover:shadow-medium">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle>2. Gere seu CV profissional</CardTitle>
                  <CardDescription>
                    Nosso sistema cria automaticamente um CV moderno e profissional em formato PDF pronto para download.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-all hover:shadow-medium">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>3. Seja encontrado</CardTitle>
                  <CardDescription>
                    Empresas e recrutadores podem visualizar seu perfil e entrar em contacto para oportunidades de emprego.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Cursos em Destaque */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-foreground">Cursos em Destaque</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Desenvolva suas competências com nossos cursos profissionais
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card className="overflow-hidden hover:shadow-medium transition-shadow">
                <img
                  src={coursesPlaceholder}
                  alt="Curso de capacitação profissional"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Marketing Digital</CardTitle>
                  <CardDescription>
                    Aprenda estratégias modernas de marketing digital e redes sociais para impulsionar sua carreira.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/cursos">Ver Mais</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-medium transition-shadow">
                <img
                  src={coursesPlaceholder}
                  alt="Curso de desenvolvimento profissional"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Gestão de Projetos</CardTitle>
                  <CardDescription>
                    Domine as melhores práticas de gestão de projetos e liderança de equipas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/cursos">Ver Mais</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-medium transition-shadow">
                <img
                  src={coursesPlaceholder}
                  alt="Curso de habilidades técnicas"
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>Informática Básica</CardTitle>
                  <CardDescription>
                    Fundamentos essenciais de informática e ferramentas de produtividade para o ambiente de trabalho.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/cursos">Ver Mais</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/cursos">
                  Ver Todos os Cursos
                  <GraduationCap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Vagas Recentes */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-foreground">Vagas Recentes</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Oportunidades atualizadas diariamente de empresas em todo o país
              </p>
            </div>

            <div className="grid gap-4 max-w-3xl mx-auto mb-8">
              {[
                { title: "Gestor de Vendas", company: "Empresa ABC", location: "Luanda", date: "Há 2 dias" },
                { title: "Desenvolvedor Web", company: "Tech Solutions", location: "Luanda", date: "Há 3 dias" },
                { title: "Assistente Administrativo", company: "XYZ Lda", location: "Benguela", date: "Há 5 dias" },
              ].map((vaga, index) => (
                <Card key={index} className="hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vaga.title}</CardTitle>
                        <CardDescription>
                          {vaga.company} • {vaga.location}
                        </CardDescription>
                      </div>
                      <span className="text-sm text-muted-foreground">{vaga.date}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/vagas">
                  Ver Todas as Vagas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-foreground">O Que Dizem Sobre Nós</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Histórias de sucesso de quem encontrou oportunidades através da plataforma
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial1}
                      alt="Maria Silva, profissional satisfeita"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Maria Silva</CardTitle>
                      <CardDescription>Marketing Manager</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "O EmpregaJá mudou minha vida profissional. Criei meu perfil em minutos e em menos de uma semana já tinha entrevistas agendadas. Recomendo!"
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial2}
                      alt="João Costa, profissional satisfeito"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">João Costa</CardTitle>
                      <CardDescription>Gestor de Vendas</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Plataforma excelente! O CV gerado automaticamente é muito profissional. Consegui meu emprego atual graças ao EmpregaJá."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <div className="container text-center space-y-8">
            <h2 className="text-primary-foreground">Pronto para Mostrar o Seu Talento?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Junte-se a milhares de profissionais angolanos que já encontraram oportunidades através da nossa plataforma.
            </p>
            <Button variant="secondary" size="xl" asChild>
              <Link to="/cadastro">
                Criar Perfil Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
