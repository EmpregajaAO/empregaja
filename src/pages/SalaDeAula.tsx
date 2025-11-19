import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Lock, MessageSquare } from "lucide-react";
import { ModuleViewer } from "@/components/classroom/ModuleViewer";
import { AssistantChat } from "@/components/classroom/AssistantChat";
import { CourseProgress } from "@/components/classroom/CourseProgress";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_number: number;
  is_locked: boolean;
}

interface Enrollment {
  id: string;
  course_id: string;
  payment_verified: boolean;
  status: string;
  courses: Course;
}

export default function SalaDeAula() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAssistant, setShowAssistant] = useState(true);

  useEffect(() => {
    loadEnrollmentAndModules();
  }, [courseId]);

  const loadEnrollmentAndModules = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/cadastro");
        return;
      }

      // Buscar candidato
      const { data: candidato } = await supabase
        .from("candidatos")
        .select("id")
        .eq("perfil_id", (await supabase.from("perfis").select("id").eq("user_id", user.id).single()).data?.id)
        .single();

      if (!candidato) {
        toast({
          title: "Erro",
          description: "Perfil de candidato não encontrado",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Buscar matrícula
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select(`
          *,
          courses(*)
        `)
        .eq("candidato_id", candidato.id)
        .eq("course_id", courseId)
        .eq("payment_verified", true)
        .single();

      if (enrollmentError || !enrollmentData) {
        toast({
          title: "Acesso Negado",
          description: "Você precisa estar matriculado e ter o pagamento aprovado para acessar este curso",
          variant: "destructive",
        });
        navigate("/cursos");
        return;
      }

      setEnrollment(enrollmentData);

      // Buscar módulos
      const { data: modulesData, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_number");

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

      // Calcular progresso
      const progressValue = await calculateProgress(enrollmentData.id);
      setProgress(progressValue);

    } catch (error) {
      console.error("Erro ao carregar sala de aula:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o curso",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = async (enrollmentId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_course_progress', { p_enrollment_id: enrollmentId });
      
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error("Erro ao calcular progresso:", error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar sala de aula...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{enrollment.courses.title}</h1>
              <p className="text-primary-foreground/80 mt-1">{enrollment.courses.description}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {enrollment.courses.category}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm font-medium">{progress.toFixed(0)}% Completo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Módulos do Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module, index) => (
                  <Button
                    key={module.id}
                    variant={selectedModule?.id === module.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => !module.is_locked && setSelectedModule(module)}
                    disabled={module.is_locked}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {module.is_locked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span className="flex-1 text-left">
                        Módulo {module.order_number}: {module.title}
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseProgress enrollmentId={enrollment.id} />
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2">
            {selectedModule ? (
              <ModuleViewer 
                module={selectedModule} 
                enrollmentId={enrollment.id}
                onProgressUpdate={() => loadEnrollmentAndModules()}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo à Sala de Aula!</h2>
                  <p className="text-muted-foreground">
                    Selecione um módulo na barra lateral para começar a aprender
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Assistant Toggle */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setShowAssistant(!showAssistant)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Assistant Chat */}
      {showAssistant && enrollment && (
        <AssistantChat 
          enrollmentId={enrollment.id}
          courseName={enrollment.courses.title}
          onClose={() => setShowAssistant(false)}
        />
      )}
    </div>
  );
}
