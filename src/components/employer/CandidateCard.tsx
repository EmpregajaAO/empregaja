import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, BadgeCheck, User } from "lucide-react";
import InterviewScheduleModal from "./InterviewScheduleModal";
import CandidateDetailModal from "./CandidateDetailModal";

interface CandidateCardProps {
  candidato: {
    id: string;
    numero_candidato: string;
    tipo_conta: 'basico' | 'ativo' | 'pro';
    perfil_id: string;
    perfis: {
      nome_completo: string;
      telefone: string | null;
    };
  };
  empregadorId: string;
}

const CandidateCard = ({ candidato, empregadorId }: CandidateCardProps) => {
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isPro = candidato.tipo_conta === 'pro';

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow ${isPro ? 'border-primary border-2' : ''}`}>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{candidato.perfis.nome_completo}</h3>
                <p className="text-sm text-muted-foreground">#{candidato.numero_candidato}</p>
              </div>
            </div>
            {isPro && (
              <Badge className="bg-primary gap-1">
                <BadgeCheck className="h-3 w-3" />
                Recomendado
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {candidato.perfis.telefone && (
            <div className="text-sm">
              <span className="font-medium">Telefone:</span>{" "}
              <span className="text-muted-foreground">{candidato.perfis.telefone}</span>
            </div>
          )}
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowDetailModal(true)}
          >
            Ver Perfil Completo
          </Button>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => setShowInterviewModal(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Entrevista
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setShowDetailModal(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </CardFooter>
      </Card>

      <InterviewScheduleModal
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
        candidatoId={candidato.id}
        candidatoNome={candidato.perfis.nome_completo}
        empregadorId={empregadorId}
      />

      <CandidateDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        candidato={candidato}
        empregadorId={empregadorId}
      />
    </>
  );
};

export default CandidateCard;
