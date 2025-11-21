import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
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
import { AdminRoute } from "@/components/AdminRoute";

interface Assessment {
  id: string;
  title: string;
}

interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  order_number: number;
}

function AdminQuestoesContent() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "multiple_choice",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "A",
    explanation: "",
    points: 1,
    order_number: 1,
  });

  useEffect(() => {
    if (assessmentId) {
      loadAssessment();
      loadQuestions();
    }
  }, [assessmentId]);

  const loadAssessment = async () => {
    if (!assessmentId) return;

    try {
      const { data, error } = await supabase
        .from("course_assessments")
        .select("id, title")
        .eq("id", assessmentId)
        .single();

      if (error) throw error;
      setAssessment(data);
    } catch (error) {
      console.error("Erro ao carregar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a avaliação",
        variant: "destructive",
      });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    if (!assessmentId) return;

    try {
      const { data, error } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("assessment_id", assessmentId)
        .order("order_number");

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as questões",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question_text: question.question_text,
        question_type: question.question_type || "multiple_choice",
        option_a: question.option_a || "",
        option_b: question.option_b || "",
        option_c: question.option_c || "",
        option_d: question.option_d || "",
        correct_answer: question.correct_answer,
        explanation: question.explanation || "",
        points: question.points || 1,
        order_number: question.order_number,
      });
    } else {
      setEditingQuestion(null);
      const nextOrderNumber = questions.length > 0 
        ? Math.max(...questions.map(q => q.order_number)) + 1 
        : 1;
      setFormData({
        question_text: "",
        question_type: "multiple_choice",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "A",
        explanation: "",
        points: 1,
        order_number: nextOrderNumber,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!assessmentId) return;

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from("assessment_questions")
          .update(formData)
          .eq("id", editingQuestion.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Questão atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from("assessment_questions")
          .insert([{ ...formData, assessment_id: assessmentId }]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Questão criada com sucesso" });
      }

      setIsDialogOpen(false);
      loadQuestions();
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a questão",
        variant: "destructive",
      });
    }
  };

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta questão?")) return;

    try {
      const { error } = await supabase
        .from("assessment_questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Questão eliminada com sucesso",
      });

      loadQuestions();
    } catch (error) {
      console.error("Erro ao eliminar questão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a questão",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg">Avaliação não encontrada</p>
          <Button onClick={() => navigate("/admin")} className="mt-4">
            Voltar ao Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Painel
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            Questões: {assessment.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questões da Avaliação</CardTitle>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Questão
            </Button>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma questão encontrada. Adicione a primeira questão à avaliação.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Questão</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Resposta Correta</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <Badge variant="secondary">{question.order_number}</Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate">{question.question_text}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {question.question_type === "multiple_choice" ? "Múltipla Escolha" : question.question_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{question.correct_answer}</Badge>
                        </TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDialog(question)}
                              className="gap-1"
                            >
                              <Pencil className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteQuestion(question.id)}
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
                {editingQuestion ? "Editar Questão" : "Adicionar Nova Questão"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question_text">Texto da Questão</Label>
                <Textarea
                  id="question_text"
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="Digite a questão aqui..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question_type">Tipo de Questão</Label>
                  <Select
                    value={formData.question_type}
                    onValueChange={(value) => setFormData({ ...formData, question_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                      <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="points">Pontos</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseFloat(e.target.value) })}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>
              
              {formData.question_type === "multiple_choice" && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="option_a">Opção A</Label>
                    <Input
                      id="option_a"
                      value={formData.option_a}
                      onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                      placeholder="Digite a opção A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="option_b">Opção B</Label>
                    <Input
                      id="option_b"
                      value={formData.option_b}
                      onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                      placeholder="Digite a opção B"
                    />
                  </div>
                  <div>
                    <Label htmlFor="option_c">Opção C</Label>
                    <Input
                      id="option_c"
                      value={formData.option_c}
                      onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                      placeholder="Digite a opção C"
                    />
                  </div>
                  <div>
                    <Label htmlFor="option_d">Opção D</Label>
                    <Input
                      id="option_d"
                      value={formData.option_d}
                      onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                      placeholder="Digite a opção D"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="correct_answer">Resposta Correta</Label>
                <Select
                  value={formData.correct_answer}
                  onValueChange={(value) => setFormData({ ...formData, correct_answer: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.question_type === "multiple_choice" ? (
                      <>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="true">Verdadeiro</SelectItem>
                        <SelectItem value="false">Falso</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="explanation">Explicação (opcional)</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explicação da resposta correta..."
                  rows={3}
                />
              </div>

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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveQuestion}>
                {editingQuestion ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function AdminQuestoes() {
  return (
    <AdminRoute>
      <AdminQuestoesContent />
    </AdminRoute>
  );
}
