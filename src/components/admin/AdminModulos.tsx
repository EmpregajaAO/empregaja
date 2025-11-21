import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, BookOpen, Lock, Unlock } from "lucide-react";
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
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_number: number;
  is_locked: boolean;
}

export function AdminModulos() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order_number: 1,
    is_locked: false,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules();
    }
  }, [selectedCourseId]);

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
        .select("*")
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

  const handleOpenDialog = (module?: Module) => {
    if (module) {
      setEditingModule(module);
      setFormData({
        title: module.title,
        description: module.description || "",
        order_number: module.order_number,
        is_locked: module.is_locked,
      });
    } else {
      setEditingModule(null);
      const nextOrderNumber = modules.length > 0 
        ? Math.max(...modules.map(m => m.order_number)) + 1 
        : 1;
      setFormData({
        title: "",
        description: "",
        order_number: nextOrderNumber,
        is_locked: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveModule = async () => {
    if (!selectedCourseId) {
      toast({
        title: "Erro",
        description: "Selecione um curso primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingModule) {
        const { error } = await supabase
          .from("course_modules")
          .update(formData)
          .eq("id", editingModule.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Módulo atualizado com sucesso" });
      } else {
        const { error } = await supabase
          .from("course_modules")
          .insert([{ ...formData, course_id: selectedCourseId }]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Módulo criado com sucesso" });
      }

      setIsDialogOpen(false);
      loadModules();
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o módulo",
        variant: "destructive",
      });
    }
  };

  const toggleModuleLock = async (moduleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("course_modules")
        .update({ is_locked: !currentStatus })
        .eq("id", moduleId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Módulo ${!currentStatus ? "bloqueado" : "desbloqueado"} com sucesso`,
      });

      loadModules();
    } catch (error) {
      console.error("Erro ao alterar status do módulo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do módulo",
        variant: "destructive",
      });
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Tem certeza que deseja eliminar este módulo?")) return;

    try {
      const { error } = await supabase
        .from("course_modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Módulo eliminado com sucesso",
      });

      loadModules();
    } catch (error) {
      console.error("Erro ao eliminar módulo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o módulo",
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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Gestão de Módulos
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full sm:w-[300px]">
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
            <Button 
              onClick={() => handleOpenDialog()} 
              className="gap-2 w-full sm:w-auto"
              disabled={!selectedCourseId}
            >
              <Plus className="h-4 w-4" />
              Adicionar Módulo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum módulo encontrado. Adicione o primeiro módulo ao curso.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>
                        <Badge variant="secondary">{module.order_number}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{module.title}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {module.description || "—"}
                      </TableCell>
                      <TableCell>
                        {module.is_locked ? (
                          <Badge variant="destructive" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Bloqueado
                          </Badge>
                        ) : (
                          <Badge variant="default" className="gap-1">
                            <Unlock className="h-3 w-3" />
                            Aberto
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleModuleLock(module.id, module.is_locked)}
                            className="gap-1"
                          >
                            {module.is_locked ? (
                              <><Unlock className="h-3 w-3" /> Desbloquear</>
                            ) : (
                              <><Lock className="h-3 w-3" /> Bloquear</>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(module)}
                            className="gap-1"
                          >
                            <Pencil className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteModule(module.id)}
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
              {editingModule ? "Editar Módulo" : "Adicionar Novo Módulo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Módulo</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Introdução ao HTML e CSS"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição do que será abordado neste módulo"
                rows={4}
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
              <div>
                <Label htmlFor="is_locked">Status</Label>
                <Select
                  value={formData.is_locked.toString()}
                  onValueChange={(value) => setFormData({ ...formData, is_locked: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Aberto</SelectItem>
                    <SelectItem value="true">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveModule}>
              {editingModule ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
