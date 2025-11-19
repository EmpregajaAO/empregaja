import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Image as ImageIcon,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { LessonContent } from "./LessonContent";
import { ModuleAssessment } from "./ModuleAssessment";

interface Module {
  id: string;
  title: string;
  description: string;
  order_number: number;
}

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  content_text: string | null;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  duration_minutes: number | null;
  order_number: number;
  is_preview: boolean;
}

interface ModuleViewerProps {
  module: Module;
  enrollmentId: string;
  onProgressUpdate: () => void;
}

export function ModuleViewer({ module, enrollmentId, onProgressUpdate }: ModuleViewerProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showAssessment, setShowAssessment] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLessons();
    loadProgress();
  }, [module.id]);

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from("course_lessons")
        .select("*")
        .eq("module_id", module.id)
        .order("order_number");

      if (error) throw error;
      setLessons(data || []);
      if (data && data.length > 0) {
        setSelectedLesson(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as aulas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from("student_progress")
        .select("lesson_id")
        .eq("enrollment_id", enrollmentId)
        .eq("completed", true);

      if (error) throw error;
      const completed = new Set(data.map(p => p.lesson_id));
      setCompletedLessons(completed);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from("student_progress")
        .upsert({
          enrollment_id: enrollmentId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setCompletedLessons(prev => new Set(prev).add(lessonId));
      onProgressUpdate();

      toast({
        title: "Aula Concluída!",
        description: "Seu progresso foi salvo com sucesso",
      });
    } catch (error) {
      console.error("Erro ao marcar aula como concluída:", error);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "audio": return <Headphones className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
      case "image": return <ImageIcon className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const goToNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex < lessons.length - 1) {
      setSelectedLesson(lessons[currentIndex + 1]);
    } else {
      setShowAssessment(true);
    }
  };

  const goToPreviousLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    if (currentIndex > 0) {
      setSelectedLesson(lessons[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar módulo...</p>
        </CardContent>
      </Card>
    );
  }

  if (showAssessment) {
    return (
      <ModuleAssessment 
        moduleId={module.id}
        enrollmentId={enrollmentId}
        onComplete={() => {
          setShowAssessment(false);
          onProgressUpdate();
        }}
        onBack={() => setShowAssessment(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Módulo {module.order_number}: {module.title}
            </CardTitle>
            <Badge variant="outline">
              {completedLessons.size} / {lessons.length} Aulas
            </Badge>
          </div>
          {module.description && (
            <p className="text-muted-foreground mt-2">{module.description}</p>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Lessons Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Aulas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lessons.map((lesson) => (
              <Button
                key={lesson.id}
                variant={selectedLesson?.id === lesson.id ? "default" : "outline"}
                className="w-full justify-start text-sm"
                onClick={() => setSelectedLesson(lesson)}
              >
                <div className="flex items-center gap-2 w-full">
                  {completedLessons.has(lesson.id) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    getContentIcon(lesson.content_type)
                  )}
                  <span className="flex-1 text-left truncate">
                    {lesson.order_number}. {lesson.title}
                  </span>
                </div>
              </Button>
            ))}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowAssessment(true)}
            >
              Avaliação Final
            </Button>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            {selectedLesson ? (
              <>
                <LessonContent 
                  lesson={selectedLesson}
                  enrollmentId={enrollmentId}
                />
                
                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={goToPreviousLesson}
                    disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  {!completedLessons.has(selectedLesson.id) && (
                    <Button
                      variant="secondary"
                      onClick={() => markLessonComplete(selectedLesson.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  )}

                  <Button
                    onClick={goToNextLesson}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Selecione uma aula para começar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
