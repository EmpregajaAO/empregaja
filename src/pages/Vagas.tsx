import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Briefcase, Clock } from "lucide-react";

const Vagas = () => {
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

            <div className="max-w-4xl mx-auto space-y-4">
              {vagas.map((vaga, index) => (
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
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Vagas;
