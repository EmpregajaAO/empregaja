import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Video, FileText, Headphones, File, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Lesson {
  id: string;
  module_id: string;
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

export function AdminAulas() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content_type: "video",
    content_text: "",
    video_url: "",
    audio_url: "",
    pdf_url: "",
    duration_minutes: 0,
    order_number: 1,
    is_preview: false,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules();
      setSelectedModuleId("");
      setLessons([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons();
    }
  }, [selectedModuleId]);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("is_active", true)
        .order("title");

      if (error) throw error;
      setCourses(data || []);
      
      if (data && data.length > 0) {
        setSelectedCourseId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async () => {
    if (!selectedCourseId) return;

    try {
      const { data, error } = await supabase
        .from("course_modules")
        .select("id, title, course_id")
        .eq("course_id", selectedCourseId)
        .order("order_number");

      if (error) throw error;
      setModules(data || []);
      
      if (data && data.length > 0) {
        setSelectedModuleId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os módulos",
        variant: "destructive",
      });
    }
  };

  const loadLessons = async () => {
    if (!selectedModuleId) return;

    try {
      const { data, error } = await supabase
        .from("course_lessons")
        .select("*")
        .eq("module_id", selectedModuleId)
        .order("order_number");

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as aulas",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        content_type: lesson.content_type,
        content_text: lesson.content_text || "",
        video_url: lesson.video_url || "",
        audio_url: lesson.audio_url || "",
        pdf_url: lesson.pdf_url || "",
        duration_minutes: lesson.duration_minutes || 0,
        order_number: lesson.order_number,
        is_preview: lesson.is_preview,
      });
    } else {
      setEditingLesson(null);
      const nextOrderNumber = lessons.length > 0 
        ? Math.max(...lessons.map(l => l.order_number)) + 1 
        : 1;
      setFormData({
        title: "",
        content_type: "video",
        content_text: "",
        video_url: "",
        audio_url: "",
        pdf_url: "",
        duration_minutes: 0,
        order_number: nextOrderNumber,
        is_preview: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!selectedModuleId) {
      toast({
        title: "Erro",
        description: "Selecione um módulo primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLesson) {
        const { error } = await supabase
          .from("course_lessons")
          .update(formData)
          .eq("id", editingLesson.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Aula atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from("course_lessons")
          .insert([{ ...formData, module_id: selectedModuleId }]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Aula criada com sucesso" });
      }

      setIsDialogOpen(false);
      loadLessons();
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a aula",
        variant: "destructive",
      });
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta aula?")) return;

    try {
      const { error } = await supabase
        .from("course_lessons")
        .delete()
        .eq("id", lessonId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Aula eliminada com sucesso",
      });

      loadLessons();
    } catch (error) {
      console.error("Erro ao eliminar aula:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a aula",
        variant: "destructive",
      });
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "video": return <Video className="h-4 w-4" />;
      case "audio": return <Headphones className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
      case "mixed": return <File className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div>A carregar...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Gestão de Aulas
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId} disabled={!selectedCourseId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Selecione um módulo" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="gap-2 w-full sm:w-auto sm:ml-auto"
              disabled={!selectedModuleId}
            >
              <Plus className="h-4 w-4" />
              Adicionar Aula
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma aula encontrada. Adicione a primeira aula ao módulo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <Badge variant="secondary">{lesson.order_number}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {getContentIcon(lesson.content_type)}
                          {lesson.content_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lesson.duration_minutes ? `${lesson.duration_minutes} min` : "—"}
                      </TableCell>
                      <TableCell>
                        {lesson.is_preview ? (
                          <Badge variant="default" className="gap-1">
                            <Eye className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Não</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(lesson)}
                            className="gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteLesson(lesson.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Editar Aula" : "Adicionar Nova Aula"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Aula</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Introdução ao HTML"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content_type">Tipo de Conteúdo</Label>
                <Select
                  value={formData.content_type}
                  onValueChange={(value) => setFormData({ ...formData, content_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration_minutes">Duração (minutos)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="video_url">URL do Vídeo</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="audio_url">URL do Áudio</Label>
              <Input
                id="audio_url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="pdf_url">URL do PDF</Label>
              <Input
                id="pdf_url"
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="content_text">Conteúdo de Texto (HTML)</Label>
              <Textarea
                id="content_text"
                value={formData.content_text}
                onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
                placeholder="Conteúdo escrito da aula (pode usar HTML básico)"
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_number">Ordem</Label>
                <Input
                  id="order_number"
                  type="number"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="is_preview"
                  checked={formData.is_preview}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_preview: checked as boolean })}
                />
                <Label htmlFor="is_preview" className="cursor-pointer">
                  Aula de Preview (visível sem matrícula)
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLesson}>
              {editingLesson ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
