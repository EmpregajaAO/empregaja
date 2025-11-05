import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award } from "lucide-react";
import coursesPlaceholder from "@/assets/courses-placeholder.jpg";

const Cursos = () => {
  const courses = [
    { title: "Marketing Digital", description: "Estratégias modernas de marketing e redes sociais", category: "Negócios" },
    { title: "Gestão de Projetos", description: "Metodologias ágeis e liderança de equipas", category: "Gestão" },
    { title: "Informática Básica", description: "Fundamentos e ferramentas de produtividade", category: "Tecnologia" },
    { title: "Excel Avançado", description: "Análise de dados e automação", category: "Tecnologia" },
    { title: "Atendimento ao Cliente", description: "Técnicas de comunicação e satisfação", category: "Negócios" },
    { title: "Gestão Financeira", description: "Finanças pessoais e empresariais", category: "Gestão" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
              <h1>Cursos Profissionais</h1>
              <p className="text-xl text-muted-foreground">
                Desenvolva suas competências e impulsione sua carreira com nossos cursos certificados
              </p>
              <div className="flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Certificados Reconhecidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span>Instrutores Experientes</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-medium transition-shadow">
                  <img
                    src={coursesPlaceholder}
                    alt={`Curso de ${course.title}`}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <div className="text-sm text-accent font-medium mb-2">{course.category}</div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cursos;
