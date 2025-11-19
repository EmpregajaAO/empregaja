import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

interface InterviewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidatoId: string;
  candidatoNome: string;
  empregadorId: string;
}

const InterviewScheduleModal = ({
  open,
  onOpenChange,
  candidatoId,
  candidatoNome,
  empregadorId,
}: InterviewScheduleModalProps) => {
  const [loading, setLoading] = useState(false);
  const [dataHora, setDataHora] = useState("");
  const [tipo, setTipo] = useState<"presencial" | "virtual">("presencial");
  const [localOuLink, setLocalOuLink] = useState("");
  const [vaga, setVaga] = useState("");
  const [notas, setNotas] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("entrevistas").insert({
        candidato_id: candidatoId,
        empregador_id: empregadorId,
        data_hora: dataHora,
        tipo,
        local_ou_link: localOuLink,
        notas: `Vaga: ${vaga}\n\n${notas}`,
        status: "agendada",
      });

      if (error) throw error;

      toast.success("Entrevista agendada com sucesso!");
      onOpenChange(false);
      
      // Limpar formulário
      setDataHora("");
      setLocalOuLink("");
      setVaga("");
      setNotas("");
    } catch (error) {
      console.error("Erro ao agendar entrevista:", error);
      toast.error("Erro ao agendar entrevista");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendar Entrevista com {candidatoNome}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataHora">Data e Hora</Label>
            <Input
              id="dataHora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Entrevista</Label>
            <RadioGroup value={tipo} onValueChange={(value: any) => setTipo(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presencial" id="presencial" />
                <Label htmlFor="presencial">Presencial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual">Online</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localOuLink">
              {tipo === "presencial" ? "Local" : "Link da reunião"}
            </Label>
            <Input
              id="localOuLink"
              value={localOuLink}
              onChange={(e) => setLocalOuLink(e.target.value)}
              placeholder={tipo === "presencial" ? "Ex: Escritório principal" : "Ex: https://meet.google.com/..."}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaga">Vaga Disponível</Label>
            <Input
              id="vaga"
              value={vaga}
              onChange={(e) => setVaga(e.target.value)}
              placeholder="Ex: Desenvolvedor Full Stack"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Observações (opcional)</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Informações adicionais sobre a entrevista"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewScheduleModal;
