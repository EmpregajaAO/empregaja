import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

interface CourseProgressProps {
  enrollmentId: string;
}

export function CourseProgress({ enrollmentId }: CourseProgressProps) {
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalTime: 0,
    lastAccessed: null as string | null
  });

  useEffect(() => {
    loadProgress();
  }, [enrollmentId]);

  const loadProgress = async () => {
    try {
      // Buscar todas as aulas do curso
      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("course_id")
        .eq("id", enrollmentId)
        .single();

      if (!enrollment) return;

      const { data: modules } = await supabase
        .from("course_modules")
        .select("id")
        .eq("course_id", enrollment.course_id);

      if (!modules) return;

      const moduleIds = modules.map(m => m.id);

      const { data: lessons } = await supabase
        .from("course_lessons")
        .select("id, duration_minutes")
        .in("module_id", moduleIds);

      const totalLessons = lessons?.length || 0;

      // Buscar progresso
      const { data: progress } = await supabase
        .from("student_progress")
        .select("*")
        .eq("enrollment_id", enrollmentId)
        .eq("completed", true);

      const completedLessons = progress?.length || 0;

      // Calcular tempo total gasto
      const { data: progressWithTime } = await supabase
        .from("student_progress")
        .select("time_spent_minutes")
        .eq("enrollment_id", enrollmentId);

      const totalTime = progressWithTime?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;

      // Último acesso
      const { data: lastProgress } = await supabase
        .from("student_progress")
        .select("last_accessed_at")
        .eq("enrollment_id", enrollmentId)
        .order("last_accessed_at", { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalLessons,
        completedLessons,
        totalTime,
        lastAccessed: lastProgress?.last_accessed_at || null
      });

    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  };

  const progressPercentage = stats.totalLessons > 0 
    ? (stats.completedLessons / stats.totalLessons) * 100 
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progresso Total</span>
          <span className="text-sm text-muted-foreground">
            {stats.completedLessons} / {stats.totalLessons} aulas
          </span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{stats.completedLessons}</p>
            <p className="text-xs text-muted-foreground">Aulas Concluídas</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{Math.round(stats.totalTime / 60)}h</p>
            <p className="text-xs text-muted-foreground">Tempo de Estudo</p>
          </div>
        </div>
      </div>

      {stats.lastAccessed && (
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Último acesso: {new Date(stats.lastAccessed).toLocaleDateString('pt-AO', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}

      {progressPercentage === 100 && (
        <Badge className="w-full justify-center gap-2" variant="default">
          <CheckCircle className="h-4 w-4" />
          Curso Concluído!
        </Badge>
      )}
    </div>
  );
}
