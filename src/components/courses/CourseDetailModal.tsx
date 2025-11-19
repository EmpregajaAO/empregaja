import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course } from "@/data/coursesData";
import { CheckCircle, BookOpen } from "lucide-react";

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export const CourseDetailModal = ({ course, open, onClose, onEnroll }: CourseDetailModalProps) => {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary" className="mt-2">{course.category}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Objetivos de Aprendizagem
              </h3>
              <ul className="space-y-2">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Módulos do Curso
              </h3>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.number} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                      Módulo {module.number}: {module.title}
                    </h4>
                    <ul className="space-y-1 ml-4">
                      {module.content.map((item, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investimento</p>
                  <p className="text-3xl font-bold text-primary">
                    {course.price.toLocaleString('pt-AO')} Kz
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Inclui</p>
                  <p className="font-semibold">Certificado Oficial</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button onClick={() => onEnroll(course)}>
            Inscrever-se Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
