import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BadgeCheck, User, MessageSquare } from "lucide-react";
import ChatWindow from "./ChatWindow";

interface CandidateDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const CandidateDetailModal = ({
  open,
  onOpenChange,
  candidato,
  empregadorId,
}: CandidateDetailModalProps) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (open) {
      registrarVisualizacao();
    }
  }, [open]);

  const registrarVisualizacao = async () => {
    try {
      // Registrar visualização do perfil
      await supabase.from("visualizacoes_perfil").insert({
        candidato_id: candidato.id,
        empregador_id: empregadorId,
      });
    } catch (error) {
      console.error("Erro ao registrar visualização:", error);
    }
  };

  const iniciarChat = async () => {
    try {
      // Verificar se já existe um chat
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .eq("candidato_id", candidato.id)
        .eq("empregador_id", empregadorId)
        .single();

      if (existingChat) {
        setChatId(existingChat.id);
        setShowChat(true);
        return;
      }

      // Criar novo chat
      const { data: newChat, error } = await supabase
        .from("chats")
        .insert({
          candidato_id: candidato.id,
          empregador_id: empregadorId,
          iniciado_por_empregador: true,
        })
        .select()
        .single();

      if (error) throw error;

      setChatId(newChat.id);
      setShowChat(true);
      toast.success("Chat iniciado com sucesso!");
    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
      toast.error("Erro ao iniciar chat");
    }
  };

  const isPro = candidato.tipo_conta === 'pro';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {candidato.perfis.nome_completo}
                {isPro && (
                  <Badge className="bg-primary gap-1">
                    <BadgeCheck className="h-3 w-3" />
                    Recomendado
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                #{candidato.numero_candidato}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="space-y-4">
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">Informações de Contato</h3>
                <div className="space-y-2 text-sm">
                  {candidato.perfis.telefone && (
                    <p>
                      <span className="font-medium">Telefone:</span>{" "}
                      {candidato.perfis.telefone}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Tipo de Conta:</span>{" "}
                    {candidato.tipo_conta === 'pro' ? 'Prêmio' : 
                     candidato.tipo_conta === 'ativo' ? 'Ativo' : 'Básico'}
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  ℹ️ Suas informações de contato serão compartilhadas com o candidato 
                  ao iniciar uma conversa ou agendar uma entrevista.
                </p>
              </div>

              <Button onClick={iniciarChat} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Iniciar Conversa
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            {showChat && chatId ? (
              <ChatWindow chatId={chatId} />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa iniciada ainda.</p>
                <Button onClick={iniciarChat} className="mt-4">
                  Iniciar Chat
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
