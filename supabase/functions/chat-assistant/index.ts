import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não está configurada");
    }

    // Determinar o prompt do sistema baseado no contexto
    let systemPrompt = `És um assistente virtual do EmpregaJá, uma plataforma de emprego em Angola. 

INFORMAÇÕES IMPORTANTES DA PLATAFORMA:
- Preços para Candidatos: Criação de Perfil (1000 Kz), Conta Ativa (500 Kz/mês), Conta Pro (2000 Kz/mês)
- Empregadores: Registo completamente gratuito
- Cursos: 35 cursos disponíveis via WhatsApp com IA, preços entre 1000-3000 Kz
- Privacidade: Dados pessoais dos empregadores só são revelados quando agendam entrevista
- Sistema de Chat: Apenas empregadores podem iniciar conversas com candidatos
- Entrevistas: Podem ser presenciais ou virtuais, agendadas na plataforma
- Número de Candidato: Gerado automaticamente no formato EJ######

RESPONDE SEMPRE:
- Em português de Angola
- Com informações precisas da plataforma
- Não inventes informações que não estejam aqui
- Sugere consultar as páginas específicas quando necessário (Cursos, Vagas, Sobre, etc.)
- És profissional, amigável e prestativo`;

    // Se for contexto de sala de aula, usar prompt específico para Professor Emprega Já
    if (context?.systemPrompt) {
      systemPrompt = context.systemPrompt;
    }

    console.log("Enviando mensagens para Lovable AI:", messages.length);

    // Determinar se deve usar streaming ou não
    const useStreaming = context?.streaming !== false;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: systemPrompt 
          },
          ...messages,
        ],
        stream: useStreaming,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Por favor, tenta novamente mais tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Fundos insuficientes. Por favor, adiciona créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Erro na API:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao comunicar com o assistente" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Se usar streaming, retornar o stream
    if (context?.streaming !== false) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Se não usar streaming, retornar JSON direto
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no chat assistant:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
