import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatWindowProps {
  chatId: string;
  userPerfilId?: string; // ID do perfil do usuário (empregador ou candidato)
}

interface Mensagem {
  id: string;
  conteudo: string;
  created_at: string;
  remetente_id: string;
  lida: boolean;
}

const ChatWindow = ({ chatId, userPerfilId }: ChatWindowProps) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [perfilId, setPerfilId] = useState<string>(userPerfilId || "");

  useEffect(() => {
    if (!userPerfilId) {
      loadPerfilId();
    }
    loadMensagens();
    markMessagesAsRead();
    
    // Configurar realtime para novas mensagens
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMensagens((prev) => [...prev, payload.new as Mensagem]);
          // Marcar como lida se não for do próprio usuário
          if (payload.new.remetente_id !== perfilId) {
            markMessageAsRead(payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, perfilId]);

  useEffect(() => {
    // Scroll para última mensagem
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const loadPerfilId = async () => {
    try {
      // Tenta obter o perfil do usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data } = await supabase
        .from("perfis")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setPerfilId(data.id);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil ID:", error);
    }
  };

  const loadMensagens = async () => {
    try {
      const { data, error } = await supabase
        .from("mensagens")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMensagens(data || []);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!perfilId) return;

    try {
      await supabase
        .from("mensagens")
        .update({ lida: true })
        .eq("chat_id", chatId)
        .neq("remetente_id", perfilId)
        .eq("lida", false);
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from("mensagens")
        .update({ lida: true })
        .eq("id", messageId);
    } catch (error) {
      console.error("Erro ao marcar mensagem como lida:", error);
    }
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaMensagem.trim() || !perfilId) return;

    setSending(true);
    try {
      const { error } = await supabase.from("mensagens").insert({
        chat_id: chatId,
        remetente_id: perfilId,
        conteudo: novaMensagem.trim(),
      });

      if (error) throw error;

      setNovaMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {mensagens.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma mensagem ainda. Envie a primeira!
            </p>
          ) : (
            mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.remetente_id === perfilId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.remetente_id === perfilId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.conteudo}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString("pt-PT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleEnviar} className="p-4 border-t flex gap-2">
        <Input
          value={novaMensagem}
          onChange={(e) => setNovaMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={sending || !novaMensagem.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
