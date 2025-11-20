import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, User as UserIcon, GraduationCap, Briefcase, Languages, Award, Building2, Info, CreditCard, BadgeCheck, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

const candidateFormSchema = z.object({
  fullName: z.string().trim().min(3, "Nome completo é obrigatório").max(100, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(9, "Telefone inválido").max(20, "Telefone inválido"),
  city: z.string().trim().min(2, "Cidade é obrigatória").max(100, "Nome da cidade muito longo"),
  education: z.string().trim().min(10, "Descreva sua formação").max(1000, "Descrição muito longa"),
  experience: z.string().trim().min(10, "Descreva sua experiência").max(2000, "Descrição muito longa"),
  skills: z.string().trim().min(5, "Liste suas habilidades").max(500, "Lista muito longa"),
  languages: z.string().trim().min(2, "Informe os idiomas que fala").max(200, "Lista muito longa"),
  isPremium: z.boolean().default(false),
});

const employerFormSchema = z.object({
  employerName: z.string().trim().min(3, "Nome do empregador é obrigatório").max(100, "Nome muito longo"),
  companyName: z.string().trim().min(2, "Nome da empresa é obrigatório").max(200, "Nome muito longo"),
  companySector: z.string().trim().min(3, "Ramo de atuação é obrigatório").max(200, "Descrição muito longa"),
  email: z.string().trim().email("Email inválido").max(255, "Email muito longo"),
  phone: z.string().trim().min(9, "Telefone inválido").max(20, "Telefone inválido"),
  city: z.string().trim().min(2, "Cidade é obrigatória").max(100, "Nome da cidade muito longo"),
});

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isPremiumSelected, setIsPremiumSelected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setCheckingAuth(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      isPremium: false,
    },
  });

  const employerForm = useForm<z.infer<typeof employerFormSchema>>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      employerName: "",
      companyName: "",
      companySector: "",
      email: "",
      phone: "",
      city: "",
    },
  });

  const onCandidateSubmit = async (values: z.infer<typeof candidateFormSchema>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado. Redirecionando para login...",
        variant: "destructive",
      });
      setTimeout(() => navigate("/auth"), 1500);
      return;
    }

    setLoading(true);
    try {
      // Create perfil
      const { data: perfil, error: perfilError } = await supabase
        .from("perfis")
        .insert({
          user_id: user.id,
          nome_completo: values.fullName,
          telefone: values.phone,
          tipo_utilizador: "candidato",
        })
        .select()
        .single();

      if (perfilError) throw perfilError;

      // Generate candidate number
      const { data: numeroCandidato, error: numeroError } = await supabase
        .rpc("gerar_numero_candidato");

      if (numeroError) throw numeroError;

      // Create candidato
      const { error: candidatoError } = await supabase
        .from("candidatos")
        .insert({
          perfil_id: perfil.id,
          numero_candidato: numeroCandidato,
          tipo_conta: values.isPremium ? "pro" : "basico",
        });

      if (candidatoError) throw candidatoError;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: values.isPremium 
          ? "A redirecionar para confirmação de pagamento..." 
          : "O seu perfil foi criado com sucesso!",
      });

      setTimeout(() => {
        navigate(values.isPremium ? "/confirmacao-pagamento" : "/perfil-candidato");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar perfil:", error);
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Ocorreu um erro ao criar seu perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onEmployerSubmit = async (values: z.infer<typeof employerFormSchema>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado. Redirecionando para login...",
        variant: "destructive",
      });
      setTimeout(() => navigate("/auth"), 1500);
      return;
    }

    setLoading(true);
    try {
      // Create perfil
      const { data: perfil, error: perfilError } = await supabase
        .from("perfis")
        .insert({
          user_id: user.id,
          nome_completo: values.employerName,
          telefone: values.phone,
          tipo_utilizador: "empregador",
        })
        .select()
        .single();

      if (perfilError) throw perfilError;

      // Create empregador
      const { error: empregadorError } = await supabase
        .from("empregadores")
        .insert({
          perfil_id: perfil.id,
          nome_empresa: values.companyName,
          ramo_atuacao: values.companySector,
        });

      if (empregadorError) throw empregadorError;

      toast({
        title: "Cadastro realizado!",
        description: "Seu perfil de empregador foi criado com sucesso.",
      });

      setTimeout(() => {
        navigate("/perfil-empregador");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar perfil:", error);
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Ocorreu um erro ao criar seu perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Autenticação Necessária</CardTitle>
              <CardDescription>
                Você precisa estar autenticado para completar seu cadastro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Ir para Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

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

                  {/* Escolha de Perfil */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      Escolha seu Tipo de Perfil
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Perfil Normal */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          !isPremiumSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => {
                          setIsPremiumSelected(false);
                          candidateForm.setValue('isPremium', false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={!isPremiumSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIsPremiumSelected(false);
                                candidateForm.setValue('isPremium', false);
                              }
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">Perfil Normal</h4>
                            <p className="text-2xl font-bold text-primary my-2">1.000 Kz</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>✓ Criação de Perfil</li>
                              <li>✓ CV profissional em PDF</li>
                              <li>✓ Download ilimitado do CV</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Perfil Prêmio */}
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative overflow-hidden ${
                          isPremiumSelected 
                            ? 'border-accent bg-accent/5' 
                            : 'border-border hover:border-accent/50'
                        }`}
                        onClick={() => {
                          setIsPremiumSelected(true);
                          candidateForm.setValue('isPremium', true);
                        }}
                      >
                        <div className="absolute top-2 right-2">
                          <div className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                            RECOMENDADO
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={isPremiumSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIsPremiumSelected(true);
                                candidateForm.setValue('isPremium', true);
                              }
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                              Perfil Prêmio
                              <BadgeCheck className="h-5 w-5 text-accent" />
                            </h4>
                            <p className="text-2xl font-bold text-accent my-2">2.000 Kz</p>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>✓ Tudo do Perfil Normal</li>
                              <li>✓ <strong>Selo "Perfil Recomendado"</strong></li>
                              <li>✓ Destaque visual para empregadores</li>
                              <li>✓ Maior visibilidade na plataforma</li>
                            </ul>
                            <div className="mt-3 p-2 bg-accent/10 rounded text-xs">
                              <strong>Benefício Extra:</strong> Este perfil é recomendado pelos nossos especialistas para aumentar sua visibilidade.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mensagem de Incentivo */}
                    <Alert className="border-accent/50 bg-accent/5">
                      <Info className="h-4 w-4 text-accent" />
                      <AlertDescription>
                        O pagamento garante a criação do seu perfil premium, aumentando suas chances de ser visto pelos empregadores e acesso imediato ao seu currículo profissional.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <Form {...candidateForm}>
                    <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)} className="space-y-8">
                      {/* Personal Data */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <UserIcon className="h-5 w-5 text-primary" />
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

                      {/* Informações de Pagamento */}
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <h3>Informações de Pagamento</h3>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Valor a pagar:</strong> {isPremiumSelected ? '2.000 Kz (Perfil Prêmio)' : '1.000 Kz (Perfil Normal)'}
                          </AlertDescription>
                        </Alert>

                        <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                          <div>
                            <Label className="text-sm font-semibold">IBAN para Transferência:</Label>
                            <div className="mt-1 p-3 bg-background rounded border font-mono text-sm">
                              0055 0000 8438 8152 1019 5
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-semibold">Nome da Conta:</Label>
                            <div className="mt-1 p-3 bg-background rounded border font-semibold">
                              REPAIR LUBATEC
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-semibold">Formas de Pagamento Aceitas:</Label>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Transferência Multicaixa Express</li>
                            <li>• Pagamento via ATM</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-semibold">
                            Anexar Comprovativo de Pagamento *
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Faça upload do comprovativo de transferência ou pagamento
                          </p>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                              className="max-w-xs"
                              required
                            />
                            <Upload className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {paymentProof && (
                            <p className="text-sm text-green-600">
                              ✓ Comprovativo anexado: {paymentProof.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Finalizar Cadastro e Enviar Comprovativo
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* EMPLOYER TAB */}
                <TabsContent value="employer" className="space-y-6 mt-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Cadastro Gratuito:</strong> O cadastro de empregador é totalmente gratuito. Suas informações pessoais (nome, nome da empresa e telefone) só serão compartilhadas com o candidato quando você decidir agendar uma entrevista.
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

                        <FormField
                          control={employerForm.control}
                          name="companySector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ramo de Atuação *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Tecnologia, Construção, Saúde, Educação..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

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

                      <Button type="submit" size="lg" className="w-full">
                        Criar Perfil de Empregador (Grátis)
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
