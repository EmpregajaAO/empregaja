import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
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

interface Course {
  id: string;
  title: string;
  short_description: string | null;
  description: string;
  category: string;
  level: string;
  price_kz: number;
  duration_weeks: number;
  is_active: boolean;
  total_modules: number;
  total_lessons: number;
}

export function AdminGestãoCursos() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    level: "iniciante",
    price_kz: 0,
    duration_weeks: 0,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
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

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        short_description: course.short_description || "",
        description: course.description,
        category: course.category,
        level: course.level || "iniciante",
        price_kz: course.price_kz,
        duration_weeks: course.duration_weeks,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        short_description: "",
        description: "",
        category: "",
        level: "iniciante",
        price_kz: 0,
        duration_weeks: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(formData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Curso atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from("courses")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Curso criado com sucesso" });
      }

      setIsDialogOpen(false);
      loadCourses();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o curso",
        variant: "destructive",
      });
    }
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_active: !currentStatus })
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Curso ${!currentStatus ? "ativado" : "desativado"} com sucesso`,
      });

      loadCourses();
    } catch (error) {
      console.error("Erro ao alterar status do curso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do curso",
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Tem certeza que deseja eliminar este curso?")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Curso eliminado com sucesso",
      });

      loadCourses();
    } catch (error) {
      console.error("Erro ao eliminar curso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o curso",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>A carregar cursos...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestão de Cursos</CardTitle>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Curso
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Preço (Kz)</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.price_kz.toLocaleString("pt-AO")}</TableCell>
                  <TableCell>{course.duration_weeks} semanas</TableCell>
                  <TableCell>
                    {course.is_active ? (
                      <Badge variant="default">Ativo</Badge>
                    ) : (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCourseStatus(course.id, course.is_active)}
                        className="gap-1"
                      >
                        {course.is_active ? (
                          <><EyeOff className="h-3 w-3" /> Desativar</>
                        ) : (
                          <><Eye className="h-3 w-3" /> Ativar</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(course)}
                        className="gap-1"
                      >
                        <Pencil className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCourse(course.id)}
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
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Editar Curso" : "Adicionar Novo Curso"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Curso</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Desenvolvimento Web Completo"
              />
            </div>
            <div>
              <Label htmlFor="short_description">Descrição Curta</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Resumo breve do curso"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição Completa</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do curso"
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Tecnologia"
                />
              </div>
              <div>
                <Label htmlFor="level">Nível</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_kz">Preço (Kz)</Label>
                <Input
                  id="price_kz"
                  type="number"
                  value={formData.price_kz}
                  onChange={(e) => setFormData({ ...formData, price_kz: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="duration_weeks">Duração (semanas)</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCourse}>
              {editingCourse ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
