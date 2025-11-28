import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, ChevronLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: string;
  question_text: string;
  options: any;
  correct_answer: string;
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string | null;
  passing_score: number;
  time_limit_minutes: number | null;
}

interface ModuleAssessmentProps {
  moduleId: string;
  enrollmentId: string;
  onComplete: () => void;
  onBack: () => void;
}

export function ModuleAssessment({ moduleId, enrollmentId, onComplete, onBack }: ModuleAssessmentProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAssessment();
    loadAttempts();
  }, [moduleId]);

  const loadAssessment = async () => {
    try {
      // Buscar avaliação do módulo
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("course_assessments")
        .select("*")
        .eq("module_id", moduleId)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      // Buscar questões
      const { data: questionsData, error: questionsError } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("assessment_id", assessmentData.id)
        .order("order_number");

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      console.error("Erro ao carregar avaliação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a avaliação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAttempts = async () => {
    try {
      const { count, error } = await supabase
        .from("student_assessment_attempts")
        .select("*", { count: "exact", head: true })
        .eq("enrollment_id", enrollmentId);

      if (error) throw error;
      setAttempts(count || 0);
    } catch (error) {
      console.error("Erro ao carregar tentativas:", error);
    }
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    // Calcular pontuação
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.points;
      if (answers[question.id] === question.correct_answer) {
        totalScore += question.points;
      }
    });

    const percentageScore = (totalScore / maxScore) * 100;
    const isPassed = percentageScore >= assessment.passing_score;

    setScore(totalScore);
    setPercentage(percentageScore);
    setPassed(isPassed);
    setSubmitted(true);

    // Salvar tentativa
    try {
      const { error } = await supabase
        .from("student_assessment_attempts")
        .insert({
          enrollment_id: enrollmentId,
          assessment_id: assessment.id,
          attempt_number: attempts + 1,
          score: totalScore,
          max_score: maxScore,
          percentage: percentageScore,
          passed: isPassed,
          answers: answers,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      if (isPassed) {
        toast({
          title: "Parabéns!",
          description: `Você passou na avaliação com ${percentageScore.toFixed(1)}%`,
        });
        setTimeout(() => onComplete(), 3000);
      } else {
        toast({
          title: "Não Passou",
          description: `Você obteve ${percentageScore.toFixed(1)}%. Necessário: ${assessment.passing_score}%`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar tentativa:", error);
    }
  };

  const getOptionLabel = (option: string) => {
    switch (option) {
      case "A": return "option_a";
      case "B": return "option_b";
      case "C": return "option_c";
      case "D": return "option_d";
      default: return "";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar avaliação...</p>
        </CardContent>
      </Card>
    );
  }

  if (!assessment || loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Carregando avaliação...</p>
          <Button onClick={onBack} className="mt-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{assessment.title}</CardTitle>
          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span>Nota de Aprovação: {assessment.passing_score}%</span>
            {assessment.time_limit_minutes && (
              <span>Tempo Limite: {assessment.time_limit_minutes} minutos</span>
            )}
          </div>
        </CardHeader>
      </Card>

      {submitted ? (
        <Card>
          <CardContent className="py-12 text-center">
            {passed ? (
              <>
                <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Aprovado!</h2>
                <p className="text-xl mb-4">Pontuação: {percentage.toFixed(1)}%</p>
                <Progress value={percentage} className="max-w-md mx-auto" />
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 mx-auto text-destructive mb-4" />
                <h2 className="text-3xl font-bold mb-2">Não Aprovado</h2>
                <p className="text-xl mb-4">Pontuação: {percentage.toFixed(1)}%</p>
                <Progress value={percentage} className="max-w-md mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Necessário: {assessment.passing_score}%
                </p>
                {attempts + 1 < 3 && (
                  <Button onClick={() => window.location.reload()} className="mt-4">
                    Tentar Novamente
                  </Button>
                )}
              </>
            )}

            {/* Mostrar respostas corretas */}
            <div className="mt-8 text-left max-w-2xl mx-auto">
              <h3 className="font-bold mb-4">Revisão das Questões:</h3>
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                return (
                  <Alert key={question.id} className="mb-4">
                    <AlertDescription>
                      <div className="font-medium mb-2">
                        {index + 1}. {question.question_text}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className={isCorrect ? "text-green-600" : "text-destructive"}>
                          Sua resposta: {userAnswer || "Não respondida"}
                        </div>
                        {!isCorrect && (
                          <div className="text-green-600">
                            Resposta correta: {question.correct_answer}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Questão {index + 1} de {questions.length} ({question.points} pontos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-4">{question.question_text}</p>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => 
                    setAnswers(prev => ({ ...prev, [question.id]: value }))
                  }
                >
                  {["A", "B", "C", "D"].map((option) => {
                    const optionKey = getOptionLabel(option);
                    const optionText = question[optionKey as keyof Question];
                    if (!optionText) return null;
                    
                    return (
                      <div key={option} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                        <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer">
                          {option}. {optionText as string}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Submeter Avaliação
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
