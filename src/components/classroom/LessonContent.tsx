import { Badge } from "@/components/ui/badge";
import { Video, Headphones, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  content_text: string | null;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  duration_minutes: number | null;
}

interface LessonContentProps {
  lesson: Lesson;
  enrollmentId: string;
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          {lesson.duration_minutes && (
            <Badge variant="secondary">
              {lesson.duration_minutes} minutos
            </Badge>
          )}
        </div>
      </div>

      {/* Video Content */}
      {lesson.video_url && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Video className="h-4 w-4" />
            Conteúdo em Vídeo
          </div>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <video 
              controls 
              className="w-full h-full"
              src={lesson.video_url}
            >
              Seu navegador não suporta vídeos.
            </video>
          </div>
        </div>
      )}

      {/* Audio Content */}
      {lesson.audio_url && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Headphones className="h-4 w-4" />
            Conteúdo em Áudio
          </div>
          <audio 
            controls 
            className="w-full"
            src={lesson.audio_url}
          >
            Seu navegador não suporta áudio.
          </audio>
        </div>
      )}

      {/* Text Content */}
      {lesson.content_text && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Conteúdo Escrito
          </div>
          <div className="prose prose-sm max-w-none bg-muted/50 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: lesson.content_text }} />
          </div>
        </div>
      )}

      {/* PDF Download */}
      {lesson.pdf_url && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4" />
            Material de Apoio
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(lesson.pdf_url!, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Descarregar Material em PDF
          </Button>
        </div>
      )}

      {!lesson.content_text && !lesson.video_url && !lesson.audio_url && !lesson.pdf_url && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Conteúdo em preparação</p>
        </div>
      )}
    </div>
  );
}
