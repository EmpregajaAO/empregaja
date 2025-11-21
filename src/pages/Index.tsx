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

const testimonials = [
  {
    name: "Maria Silva",
    role: "Gestora de Projetos, Luanda",
    text: "Encontrei minha oportunidade de sonho em menos de 2 semanas! A plataforma é muito fácil de usar e o CV gerado automaticamente impressionou os recrutadores.",
    image: testimonial1
  },
  {
    name: "João Costa",
    role: "Desenvolvedor Web, Benguela",
    text: "Como empregador, consigo encontrar candidatos qualificados rapidamente. O sistema de perfis profissionais facilita muito o processo de recrutamento.",
    image: testimonial2
  },
  {
    name: "Ana Fernandes",
    role: "Designer Gráfica, Luanda",
    text: "A plataforma transformou minha carreira! Consegui três entrevistas na primeira semana e hoje trabalho na empresa dos meus sonhos.",
    image: testimonial1
  },
  {
    name: "Pedro Santos",
    role: "Engenheiro Civil, Huambo",
    text: "Excelente sistema de busca. Como recrutador, economizo muito tempo encontrando candidatos com as qualificações exatas que preciso.",
    image: testimonial2
  },
  {
    name: "Carla Mendes",
    role: "Contadora, Benguela",
    text: "O processo de cadastro é super simples e o gerador de CV automático é fantástico. Recomendo para todos os profissionais em Angola!",
    image: testimonial1
  },
  {
    name: "Miguel Teixeira",
    role: "Gestor de TI, Luanda",
    text: "Encontrei profissionais altamente qualificados em tempo recorde. A plataforma realmente conecta talento com oportunidade.",
    image: testimonial2
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeModal />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container relative z-10 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8 animate-fade-in text-center lg:text-left">
                <h1 className="text-foreground text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                  Mostre o seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">talento</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  Crie seu perfil profissional, gere seu CV automaticamente e seja encontrado pelas melhores empresas de Angola.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                    <Link to="/cadastro">
                      Criar Perfil Agora
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                    <Link to="/sobre">Saiba Mais</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in mt-8 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl" />
                <img
                  src={heroImage}
                  alt="Profissionais angolanos em ambiente de trabalho moderno"
                  className="relative rounded-2xl shadow-2xl w-full h-auto max-w-md md:max-w-full mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-subtle px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
              <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Como Funciona</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Apenas 3 passos simples para começar sua jornada profissional
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
        <section className="py-12 md:py-16 lg:py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
              <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Cursos em Destaque</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Desenvolva suas competências com nossos cursos profissionais
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
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
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-subtle px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
              <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Vagas Recentes</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Oportunidades atualizadas diariamente de empresas em todo o país
              </p>
            </div>

            <div className="grid gap-3 md:gap-4 max-w-3xl mx-auto mb-6 md:mb-8">
              {[
                { title: "Gestor de Vendas", company: "Empresa ABC", location: "Luanda", date: "Há 2 dias" },
                { title: "Desenvolvedor Web", company: "Tech Solutions", location: "Luanda", date: "Há 3 dias" },
                { title: "Assistente Administrativo", company: "XYZ Lda", location: "Benguela", date: "Há 5 dias" },
              ].map((vaga, index) => (
                <Card key={index} className="hover:shadow-medium transition-shadow">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base md:text-lg">{vaga.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {vaga.company} • {vaga.location}
                        </CardDescription>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{vaga.date}</span>
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

        {/* Testimonials Carousel */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-subtle px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4">
              <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl">O que dizem sobre nós</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Histórias de sucesso de profissionais que encontraram suas oportunidades através da nossa plataforma
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="overflow-hidden">
                <div className="flex animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
                  {[...testimonials, ...testimonials].map((testimonial, index) => (
                    <div key={index} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] mx-2 md:mx-4">
                      <Card className="h-full bg-gradient-to-br from-card via-card to-primary/5 hover:shadow-glow transition-all">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                            />
                            <div className="flex-1">
                              <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                              <CardDescription>{testimonial.role}</CardDescription>
                            </div>
                          </div>
                          <CardDescription className="text-base leading-relaxed pt-4">
                            "{testimonial.text}"
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4">
          <div className="container max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
            <h2 className="text-primary-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Pronto para Mostrar o Seu Talento?</h2>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto opacity-90 px-4">
              Junte-se a milhares de profissionais angolanos que já encontraram oportunidades através da nossa plataforma.
            </p>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/cadastro">
                Criar Perfil Grátis
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
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
