import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, User, GraduationCap, Briefcase, Languages, Award, Building2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const candidateFormSchema = z.object({
  fullName: z.string().trim().min(3, "Nome completo é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(9, "Telefone inválido").max(20, "Telefone inválido"),
  city: z.string().trim().min(2, "Cidade é obrigatória").max(100, "Nome da cidade muito longo"),
  education: z.string().trim().min(10, "Descreva sua formação").max(1000, "Descrição muito longa"),
  experience: z.string().trim().min(10, "Descreva sua experiência").max(2000, "Descrição muito longa"),
  skills: z.string().trim().min(5, "Liste suas habilidades").max(500, "Lista muito longa"),
  languages: z.string().trim().min(2, "Informe os idiomas que fala").max(200, "Lista muito longa"),
});

const employerFormSchema = z.object({
  employerName: z.string().trim().min(3, "Nome do empregador é obrigatório").max(100, "Nome muito longo"),
  companyName: z.string().trim().min(2, "Nome da empresa é obrigatório").max(200, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(9, "Telefone inválido").max(20, "Telefone inválido"),
  city: z.string().trim().min(2, "Cidade é obrigatória").max(100, "Nome da cidade muito longo"),
  companyDescription: z.string().trim().min(20, "Descreva sua empresa").max(1000, "Descrição muito longa"),
});

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const candidateForm = useForm<z.infer<typeof candidateFormSchema>>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      education: "",
      experience: "",
      skills: "",
      languages: "",
    },
  });

  const employerForm = useForm<z.infer<typeof employerFormSchema>>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      employerName: "",
      companyName: "",
      email: "",
      phone: "",
      city: "",
      companyDescription: "",
    },
  });

  const onCandidateSubmit = (values: z.infer<typeof candidateFormSchema>) => {
    toast({
      title: "Cadastro realizado!",
      description: "Redirecionando para informações de pagamento...",
    });
    setTimeout(() => {
      navigate("/confirmacao-pagamento");
    }, 1500);
  };

  const onEmployerSubmit = (values: z.infer<typeof employerFormSchema>) => {
    toast({
      title: "Cadastro realizado!",
      description: "Redirecionando para informações de pagamento...",
    });
    setTimeout(() => {
      navigate("/confirmacao-pagamento");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-gradient-subtle">
        <div className="container max-w-4xl">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-3xl">Criar Perfil</CardTitle>
              <CardDescription>
                Escolha o tipo de perfil que deseja criar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="candidate" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="candidate">Candidato</TabsTrigger>
                  <TabsTrigger value="employer">Empregador</TabsTrigger>
                </TabsList>

                {/* CANDIDATE TAB */}
                <TabsContent value="candidate" className="space-y-6 mt-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Benefícios:</strong> Ao criar seu perfil, você receberá um CV profissional gerado pela plataforma que poderá baixar sempre que precisar.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold">Planos Disponíveis:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">1.000 Kz</span>
                        <span>- Criação de Perfil (inclui CV profissional para download sempre que precisar)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-primary">500 Kz/mês</span>
                        <span>- Manter conta ativa (mantém seu perfil visível aos empregadores e acesso às vagas)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-accent">2.000 Kz/mês</span>
                        <span>- Conta Pro (seu perfil será destacado e mostrado em primeiro lugar a cada empregador que entrar na plataforma, aumentando suas chances de ser contactado)</span>
                      </li>
                    </ul>
                  </div>

                  <Form {...candidateForm}>
                    <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-8">
                      {/* Personal Data */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <User className="h-5 w-5 text-primary" />
                          <h3>Dados Pessoais</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={candidateForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Completo *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Seu nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={candidateForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="seu@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={candidateForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="923 456 789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={candidateForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Luanda" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Foto de Perfil</Label>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                              className="max-w-xs"
                            />
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <h3>Formação Acadêmica</h3>
                        </div>
                        
                        <FormField
                          control={candidateForm.control}
                          name="education"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descreva sua formação *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Ex: Licenciatura em Engenharia Informática - Universidade Agostinho Neto (2018-2022)"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Experience */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <h3>Experiência Profissional</h3>
                        </div>
                        
                        <FormField
                          control={candidateForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descreva sua experiência *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Ex: Desenvolvedor Web - Empresa XYZ (2022-2025) - Desenvolvimento de aplicações web..."
                                  rows={5}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Skills */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Award className="h-5 w-5 text-primary" />
                          <h3>Habilidades e Competências</h3>
                        </div>
                        
                        <FormField
                          control={candidateForm.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Liste suas habilidades *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Ex: HTML, CSS, JavaScript, React, Comunicação, Trabalho em equipe..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Languages */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Languages className="h-5 w-5 text-primary" />
                          <h3>Idiomas</h3>
                        </div>
                        
                        <FormField
                          control={candidateForm.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Idiomas que fala *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Português (Nativo), Inglês (Fluente)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* CV Upload */}
                      <div className="space-y-2">
                        <Label>Upload de CV (Opcional)</Label>
                        <p className="text-sm text-muted-foreground">
                          Se já possui um CV, pode fazer upload para preenchimento automático
                        </p>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setCv(e.target.files?.[0] || null)}
                            className="max-w-xs"
                          />
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Criar Perfil Profissional
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* EMPLOYER TAB */}
                <TabsContent value="employer" className="space-y-6 mt-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacidade:</strong> Suas informações pessoais (nome, nome da empresa e telefone) não serão visíveis publicamente. Elas só serão compartilhadas quando você agendar uma entrevista com um candidato.
                    </AlertDescription>
                  </Alert>

                  <Form {...employerForm}>
                    <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-8">
                      {/* Employer Data */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h3>Dados do Empregador</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={employerForm.control}
                            name="employerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Empregador *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Seu nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={employerForm.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome da Empresa *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome da sua empresa" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={employerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@empresa.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={employerForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone *</FormLabel>
                                <FormControl>
                                  <Input placeholder="923 456 789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={employerForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade *</FormLabel>
                              <FormControl>
                                <Input placeholder="Luanda" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Company Description */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <h3>Sobre a Empresa</h3>
                        </div>
                        
                        <FormField
                          control={employerForm.control}
                          name="companyDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição da Empresa *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva a sua empresa, o setor de atuação, missão e valores..."
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Criar Perfil de Empregador
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
