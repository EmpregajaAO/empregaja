import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, Briefcase, Brain, Smartphone, FileText, Video, Headphones, Award, Globe } from "lucide-react";

const Cursos = () => {
  const courses = [
    {
      title: "Como Fazer um Currículo Profissional (CV)",
      description: "A IA gera o teu CV em PDF de forma profissional e pronta para enviar aos empregadores.",
      price: "1.000 Kz",
      duration: "1 semana",
      category: "💼 Emprego",
      icon: FileText,
    },
    {
      title: "Técnicas de Entrevista de Emprego",
      description: "Aprende a responder perguntas difíceis com simulações práticas e feedback da IA.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "💼 Emprego",
      icon: Briefcase,
    },
    {
      title: "Etiqueta Profissional e Comportamento no Trabalho",
      description: "Regras essenciais de postura, comunicação e comportamento no ambiente profissional.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "💼 Emprego",
      icon: Award,
    },
    {
      title: "Marketing Pessoal e Como Ser Notado pelos Empregadores",
      description: "Destaca-te e aprende a criar uma marca pessoal forte que atrai oportunidades.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "💼 Emprego",
      icon: Globe,
    },
    {
      title: "Uso de IA (ChatGPT) para Procurar Emprego",
      description: "Usa ferramentas de inteligência artificial para encontrar vagas e preparar candidaturas.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "🤖 Tecnologia",
      icon: Brain,
    },
    {
      title: "Informática Básica e Internet",
      description: "Aprende a usar computador e telemóvel para navegação, pesquisa e trabalho.",
      price: "2.000 Kz",
      duration: "3 semanas",
      category: "🤖 Tecnologia",
      icon: Smartphone,
    },
    {
      title: "Pacote Office (Word, Excel, PowerPoint)",
      description: "Domina as ferramentas mais usadas no mundo profissional para criar documentos de qualidade.",
      price: "2.500 Kz",
      duration: "3 semanas",
      category: "🤖 Tecnologia",
      icon: FileText,
    },
    {
      title: "Criação de Apresentações Profissionais",
      description: "Aprende a fazer slides impressionantes e contar histórias visuais que convencem.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "🤖 Tecnologia",
      icon: Video,
    },
    {
      title: "E-mail e Comunicação Digital Profissional",
      description: "Escreve mensagens formais e profissionais que transmitem confiança e competência.",
      price: "1.500 Kz",
      duration: "2 semanas",
      category: "💼 Comunicação",
      icon: FileText,
    },
    {
      title: "Redes Sociais para Trabalhar e Divulgar Serviços",
      description: "Usa Instagram, WhatsApp e Facebook para criar oportunidades e expandir o teu negócio.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "📱 Marketing",
      icon: Smartphone,
    },
    {
      title: "Empreendedorismo e Como Criar o Teu Próprio Negócio",
      description: "Do planejamento à execução: aprende a transformar ideias em negócios rentáveis.",
      price: "3.000 Kz",
      duration: "1 mês",
      category: "💰 Negócios",
      icon: Briefcase,
    },
    {
      title: "Gestão Financeira Pessoal",
      description: "Controla despesas, poupa dinheiro e alcança estabilidade financeira.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "💰 Negócios",
      icon: Briefcase,
    },
    {
      title: "Noções de Contabilidade Básica",
      description: "Regista receitas e despesas de forma organizada para controlar o teu negócio.",
      price: "2.500 Kz",
      duration: "2 semanas",
      category: "💰 Negócios",
      icon: FileText,
    },
    {
      title: "Planejamento e Organização de Pequenos Negócios",
      description: "Cria planos estratégicos e organiza o teu negócio para crescer de forma sustentável.",
      price: "2.500 Kz",
      duration: "2 semanas",
      category: "💰 Negócios",
      icon: Briefcase,
    },
    {
      title: "Vendas e Atendimento ao Cliente via WhatsApp",
      description: "Técnicas práticas de vendas e atendimento profissional pelo WhatsApp.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "💰 Negócios",
      icon: Smartphone,
    },
    {
      title: "Português de Angola — Escrita e Comunicação Profissional",
      description: "Melhora a tua escrita e fala para comunicar com clareza e profissionalismo.",
      price: "1.500 Kz",
      duration: "2 semanas",
      category: "📚 Idiomas",
      icon: FileText,
    },
    {
      title: "Curso de Língua Umbundu",
      description: "Aprende gramática, conversação e cultura Umbundu para comunicação local.",
      price: "3.000 Kz",
      duration: "1 mês",
      category: "📚 Idiomas",
      icon: Globe,
    },
    {
      title: "Curso de Língua Kimbundu",
      description: "Domina a gramática e conversação Kimbundu e conecta-te com a cultura local.",
      price: "3.000 Kz",
      duration: "1 mês",
      category: "📚 Idiomas",
      icon: Globe,
    },
    {
      title: "Inglês Básico para Emprego",
      description: "Vocabulário e frases úteis para entrevistas e comunicação profissional em inglês.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "📚 Idiomas",
      icon: Globe,
    },
    {
      title: "Francês Básico para Oportunidades Profissionais",
      description: "Introdução ao francês com frases práticas para o mundo do trabalho.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "📚 Idiomas",
      icon: Globe,
    },
    {
      title: "Primeiros Socorros",
      description: "Treinamento básico para salvar vidas em situações de emergência.",
      price: "1.500 Kz",
      duration: "2 semanas",
      category: "🏥 Saúde",
      icon: Award,
    },
    {
      title: "Gestão do Stress e Ansiedade",
      description: "Técnicas guiadas para controlar o stress e manter o equilíbrio emocional.",
      price: "1.500 Kz",
      duration: "2 semanas",
      category: "🏥 Saúde",
      icon: Brain,
    },
    {
      title: "Saúde e Higiene no Ambiente de Trabalho",
      description: "Regras essenciais de higiene e saúde para ambientes profissionais.",
      price: "1.000 Kz",
      duration: "1 semana",
      category: "🏥 Saúde",
      icon: Award,
    },
    {
      title: "Prevenção do HIV e Doenças Infecciosas",
      description: "Informação educativa essencial sobre prevenção e cuidados de saúde.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "🏥 Saúde",
      icon: Award,
    },
    {
      title: "Inteligência Emocional e Liderança",
      description: "Desenvolve autogestão emocional e habilidades de liderança eficaz.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "🧠 Desenvolvimento",
      icon: Brain,
    },
    {
      title: "Gestão do Tempo e Produtividade",
      description: "Organiza o teu tempo, elimina distrações e aumenta a tua produtividade.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "🧠 Desenvolvimento",
      icon: Clock,
    },
    {
      title: "Técnicas de Resolução de Problemas e Criatividade",
      description: "Habilidades práticas para resolver desafios de forma criativa e eficaz.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "🧠 Desenvolvimento",
      icon: Brain,
    },
    {
      title: "Networking Profissional",
      description: "Como criar e manter contatos úteis para avançar na carreira.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "🧠 Desenvolvimento",
      icon: Globe,
    },
    {
      title: "Como Falar em Público e Oratória",
      description: "Desenvolve confiança e clareza ao falar em público e apresentar ideias.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "🧠 Desenvolvimento",
      icon: Award,
    },
    {
      title: "Gestão de Conflitos no Trabalho",
      description: "Resolve problemas e conflitos profissionais de forma eficaz e diplomática.",
      price: "1.500 Kz",
      duration: "1 semana",
      category: "🧠 Desenvolvimento",
      icon: Briefcase,
    },
    {
      title: "Fotografia e Produção de Conteúdos para Vendas",
      description: "Cria imagens e vídeos profissionais para promover produtos e serviços.",
      price: "2.000 Kz",
      duration: "2 semanas",
      category: "🎨 Criatividade",
      icon: Video,
    },
    {
      title: "Design Gráfico Básico para Marketing",
      description: "Criação de posts, banners e material visual atrativo para redes sociais.",
      price: "2.500 Kz",
      duration: "2 semanas",
      category: "🎨 Criatividade",
      icon: Video,
    },
    {
      title: "Vídeo para Redes Sociais",
      description: "Técnicas de gravação, edição simples e publicação de vídeos impactantes.",
      price: "2.500 Kz",
      duration: "2 semanas",
      category: "🎨 Criatividade",
      icon: Video,
    },
    {
      title: "Música e Produção Simples com Telemóvel",
      description: "Criação de beats, gravação e edição musical usando apenas o teu telemóvel.",
      price: "2.500 Kz",
      duration: "1 mês",
      category: "🎨 Criatividade",
      icon: Headphones,
    },
    {
      title: "Desenho e Pintura Digital",
      description: "Expressão artística digital usando ferramentas acessíveis e criativas.",
      price: "2.000 Kz",
      duration: "1 mês",
      category: "🎨 Criatividade",
      icon: Video,
    },
  ];

  const whatsappNumber = "244923456789"; // Substituir pelo número real do WhatsApp

  const handleWhatsAppClick = (courseTitle: string) => {
    const message = encodeURIComponent(
      `Olá! Quero inscrever-me no curso: ${courseTitle}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-subtle">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
              <h1 className="text-4xl md:text-5xl font-bold">
                Cursos Essenciais para Emprego
              </h1>
              <p className="text-xl text-muted-foreground">
                Aprende via WhatsApp com IA • Certificado em PDF • 100% em Português de Angola
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <span>Via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-accent" />
                  <span>Vídeo + Áudio</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Texto + PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span>Certificado</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const IconComponent = course.icon;
                return (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:scale-105 flex flex-col"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                        <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col justify-end">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <span className="font-bold text-primary text-lg">
                          {course.price}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            <Headphones className="h-3 w-3 mr-1" />
                            Áudio
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Video className="h-3 w-3 mr-1" />
                            Vídeo
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            PDF
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Certificado
                          </Badge>
                        </div>
                        <Button
                          onClick={() => handleWhatsAppClick(course.title)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="lg"
                        >
                          👉🏽 Inscreve-te no WhatsApp Agora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 max-w-3xl mx-auto bg-card border rounded-lg p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Como Funciona?</h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Escolhe o curso que queres fazer e clica no botão de inscrição</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Serás redirecionado para o WhatsApp para confirmar a inscrição</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Recebes as aulas por texto, áudio, vídeo e PDF directamente no WhatsApp</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>No final, recebes o teu certificado em PDF para guardar e partilhar</span>
                </li>
              </ul>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Nota:</strong> Todos os cursos são 100% em Português de Angola com apoio de IA para aprendizagem personalizada.
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

export default Cursos;
