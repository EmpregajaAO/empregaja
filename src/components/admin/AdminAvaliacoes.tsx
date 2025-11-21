import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ClipboardCheck, List } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Assessment {
  id: string;
  course_id: string | null;
  module_id: string | null;
  title: string;
  description: string | null;
  assessment_type: string;
  passing_score: number | null;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  order_number: number | null;
}

export function AdminAvaliacoes() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assessment_type: "module",
    passing_score: 50,
    time_limit_minutes: 60,
    max_attempts: 3,
    order_number: 1,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules();
      setSelectedModuleId("");
      setAssessments([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      loadAssessments();
    }
  }, [selectedCourseId, selectedModuleId]);

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
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os módulos",
        variant: "destructive",
      });
    }
  };

  const loadAssessments = async () => {
    if (!selectedCourseId) return;

    try {
      let query = supabase
        .from("course_assessments")
        .select("*")
        .eq("course_id", selectedCourseId);

      if (selectedModuleId) {
        query = query.eq("module_id", selectedModuleId);
      }

      const { data, error } = await query.order("order_number");

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (assessment?: Assessment) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setFormData({
        title: assessment.title,
        description: assessment.description || "",
        assessment_type: assessment.assessment_type,
        passing_score: assessment.passing_score || 50,
        time_limit_minutes: assessment.time_limit_minutes || 60,
        max_attempts: assessment.max_attempts || 3,
        order_number: assessment.order_number || 1,
      });
    } else {
      setEditingAssessment(null);
      setFormData({
        title: "",
        description: "",
        assessment_type: selectedModuleId ? "module" : "final",
        passing_score: 50,
        time_limit_minutes: 60,
        max_attempts: 3,
        order_number: 1,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveAssessment = async () => {
    if (!selectedCourseId) {
      toast({
        title: "Erro",
        description: "Selecione um curso primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      const assessmentData = {
        ...formData,
        course_id: selectedCourseId,
        module_id: selectedModuleId || null,
      };

      if (editingAssessment) {
        const { error } = await supabase
          .from("course_assessments")
          .update(assessmentData)
          .eq("id", editingAssessment.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Avaliação atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from("course_assessments")
          .insert([assessmentData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Avaliação criada com sucesso" });
      }

      setIsDialogOpen(false);
      loadAssessments();
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação",
        variant: "destructive",
      });
    }
  };

  const deleteAssessment = async (assessmentId: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta avaliação?")) return;

    try {
      const { error } = await supabase
        .from("course_assessments")
        .delete()
        .eq("id", assessmentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Avaliação eliminada com sucesso",
      });

      loadAssessments();
    } catch (error) {
      console.error("Erro ao eliminar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a avaliação",
        variant: "destructive",
      });
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
            <ClipboardCheck className="h-5 w-5" />
            Gestão de Avaliações
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full sm:w-[220px]">
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
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Todos os módulos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os módulos</SelectItem>
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
              disabled={!selectedCourseId}
            >
              <Plus className="h-4 w-4" />
              Adicionar Avaliação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma avaliação encontrada. Adicione a primeira avaliação.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nota Mínima</TableHead>
                    <TableHead>Tempo Limite</TableHead>
                    <TableHead>Tentativas</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.title}</TableCell>
                      <TableCell>
                        <Badge variant={assessment.assessment_type === "final" ? "default" : "secondary"}>
                          {assessment.assessment_type === "final" ? "Final" : "Módulo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{assessment.passing_score}%</TableCell>
                      <TableCell>
                        {assessment.time_limit_minutes ? `${assessment.time_limit_minutes} min` : "Ilimitado"}
                      </TableCell>
                      <TableCell>
                        {assessment.max_attempts || "Ilimitado"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/questoes/${assessment.id}`)}
                            className="gap-1"
                          >
                            <List className="h-3 w-3" />
                            Questões
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(assessment)}
                            className="gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteAssessment(assessment.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAssessment ? "Editar Avaliação" : "Adicionar Nova Avaliação"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Avaliação</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Avaliação do Módulo 1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Instruções e informações sobre a avaliação"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assessment_type">Tipo</Label>
                <Select
                  value={formData.assessment_type}
                  onValueChange={(value) => setFormData({ ...formData, assessment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="module">Módulo</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="passing_score">Nota Mínima (%)</Label>
                <Input
                  id="passing_score"
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                  min={0}
                  max={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time_limit_minutes">Tempo Limite (minutos)</Label>
                <Input
                  id="time_limit_minutes"
                  type="number"
                  value={formData.time_limit_minutes}
                  onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
                  min={0}
                  placeholder="0 = Ilimitado"
                />
              </div>
              <div>
                <Label htmlFor="max_attempts">Máximo de Tentativas</Label>
                <Input
                  id="max_attempts"
                  type="number"
                  value={formData.max_attempts}
                  onChange={(e) => setFormData({ ...formData, max_attempts: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAssessment}>
              {editingAssessment ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
