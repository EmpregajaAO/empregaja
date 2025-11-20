import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2 } from "lucide-react";
import ChatWindow from "@/components/employer/ChatWindow";

interface Chat {
  id: string;
  created_at: string;
  empregadores: {
    id: string;
    nome_empresa: string;
    ramo_atuacao: string;
  };
  mensagens: Array<{
    id: string;
    lida: boolean;
    remetente_id: string;
  }>;
}

interface CandidateChatsProps {
  candidatoId: string;
  perfilId: string;
}

const CandidateChats = ({ candidatoId, perfilId }: CandidateChatsProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();

    // Configurar realtime para novos chats
    const channel = supabase
      .channel(`candidate-chats-${candidatoId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `candidato_id=eq.${candidatoId}`,
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [candidatoId]);

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select(`
          id,
          created_at,
          empregadores (
            id,
            nome_empresa,
            ramo_atuacao
          ),
          mensagens (
            id,
            lida,
            remetente_id
          )
        `)
        .eq("candidato_id", candidatoId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setChats(data || []);
      
      // Selecionar o primeiro chat automaticamente se houver
      if (data && data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadCount = (chat: Chat) => {
    return chat.mensagens.filter(
      (msg) => !msg.lida && msg.remetente_id !== perfilId
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">A carregar mensagens...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Nenhuma mensagem ainda</p>
              <p className="text-sm text-muted-foreground">
                Quando empregadores entrarem em contato, as mensagens aparecerão aqui
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      {/* Lista de chats */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversas ({chats.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4">
              {chats.map((chat) => {
                const unreadCount = getUnreadCount(chat);
                const isSelected = chat.id === selectedChatId;

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted border-transparent"
                    } border-2`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">
                            {chat.empregadores.nome_empresa}
                          </p>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.empregadores.ramo_atuacao}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Janela de chat */}
      <Card className="md:col-span-2">
        {selectedChatId ? (
          <>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                {chats.find((c) => c.id === selectedChatId)?.empregadores.nome_empresa}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ChatWindow
                chatId={selectedChatId}
                userPerfilId={perfilId}
              />
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Selecione uma conversa para começar
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CandidateChats;
