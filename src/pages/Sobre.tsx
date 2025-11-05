import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Heart } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-8">
                <h1>Sobre o EmpregaJá</h1>
                <p className="text-xl text-muted-foreground">
                  Somos uma plataforma angolana dedicada a conectar talentos com oportunidades, 
                  transformando o mercado de trabalho através da tecnologia e inovação.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Nossa Missão</CardTitle>
                    <CardDescription className="text-base">
                      Facilitar o acesso ao mercado de trabalho angolano, oferecendo ferramentas 
                      profissionais que destacam o talento de cada candidato e simplificam o 
                      processo de recrutamento para empresas.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle>Nossa Visão</CardTitle>
                    <CardDescription className="text-base">
                      Ser a principal plataforma de emprego em Angola, reconhecida pela qualidade, 
                      inovação e pelo impacto positivo na vida profissional de milhares de angolanos.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Qualidade</CardTitle>
                    <CardDescription className="text-base">
                      Comprometemo-nos com a excelência em todos os nossos serviços, desde a 
                      criação de perfis profissionais até a geração automática de CVs modernos 
                      e impactantes.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle>Compromisso</CardTitle>
                    <CardDescription className="text-base">
                      Estamos dedicados ao desenvolvimento profissional dos angolanos, oferecendo 
                      cursos de capacitação e ferramentas que aumentam a empregabilidade e 
                      competitividade no mercado.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
                <p className="text-muted-foreground mb-4">
                  O EmpregaJá nasceu da necessidade de modernizar e democratizar o acesso ao mercado 
                  de trabalho em Angola. Percebemos que muitos profissionais talentosos encontravam 
                  dificuldades em destacar suas competências e que as empresas precisavam de 
                  ferramentas mais eficientes para encontrar os candidatos ideais.
                </p>
                <p className="text-muted-foreground">
                  Hoje, somos uma plataforma completa que não apenas conecta candidatos e empresas, 
                  mas também oferece formação profissional através de cursos certificados, 
                  ferramentas de criação de CV e um sistema inteligente de correspondência entre 
                  vagas e perfis profissionais.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
