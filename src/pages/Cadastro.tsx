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
import { Upload, User, GraduationCap, Briefcase, Languages, Award } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Telefone inválido"),
  city: z.string().min(2, "Cidade é obrigatória"),
  education: z.string().min(10, "Descreva sua formação"),
  experience: z.string().min(10, "Descreva sua experiência"),
  skills: z.string().min(5, "Liste suas habilidades"),
  languages: z.string().min(2, "Informe os idiomas que fala"),
});

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const [cv, setCv] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values, { photo, cv });
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
              <CardTitle className="text-3xl">Cadastro de Candidato</CardTitle>
              <CardDescription>
                Preencha todos os campos para criar seu perfil profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Data */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <User className="h-5 w-5 text-primary" />
                      <h3>Dados Pessoais</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
