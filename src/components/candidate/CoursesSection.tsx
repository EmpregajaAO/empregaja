import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Download, Upload, Award } from "lucide-react";

interface CoursesSectionProps {
  candidatoId: string;
}

export default function CoursesSection({ candidatoId }: CoursesSectionProps) {
  // TODO: Fetch actual courses from database
  const completedCourses = [];

  return (
    <Card className="p-6 bg-panel-courses/30 border-panel-courses-foreground/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-panel-courses rounded-lg">
          <GraduationCap className="w-6 h-6 text-panel-courses-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Cursos e Certificados</h2>
      </div>

      <div className="space-y-4">
        {completedCourses.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Você ainda não completou nenhum curso na plataforma.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/cursos'}>
              Explorar Cursos Disponíveis
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {completedCourses.map((course: any) => (
              <div
                key={course.id}
                className="p-4 bg-card rounded-lg border hover:border-panel-courses-foreground/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-panel-courses rounded-lg">
                      <GraduationCap className="w-5 h-5 text-panel-courses-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Concluído em {course.completed_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Nota: {course.score}%</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Certificado
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => document.getElementById('cert-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Anexar Certificado Externo (Opcional)
          </Button>
          <input
            id="cert-upload"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Você pode anexar certificados de outras instituições
          </p>
        </div>
      </div>
    </Card>
  );
}
