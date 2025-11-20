import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificacaoRequest {
  user_id: string;
  email: string;
  nome: string;
  tipo: "aprovacao_perfil" | "rejeicao_perfil" | "aprovacao_curso" | "rejeicao_curso" | "aprovacao_empregador" | "rejeicao_empregador" | "aprovacao_conta_pro";
  detalhes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, nome, tipo, detalhes }: NotificacaoRequest = await req.json();

    console.log("Processando notificação:", { user_id, email, tipo });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let titulo = "";
    let mensagem = "";
    let emailSubject = "";
    let emailHtml = "";

    switch (tipo) {
      case "aprovacao_perfil":
        titulo = "Perfil Aprovado ✓";
        mensagem = "Parabéns! Seu perfil foi aprovado e agora você tem acesso completo à plataforma EmpregaJá.";
        emailSubject = "Seu perfil foi aprovado no EmpregaJá!";
        emailHtml = `<h1>Olá, ${nome}!</h1><p>Temos boas notícias! 🎉</p><p><strong>Seu perfil foi aprovado</strong> e agora você pode aproveitar todos os recursos da plataforma EmpregaJá.</p><p>Acesse agora: <a href="https://empregaja.com">https://empregaja.com</a></p><p>Atenciosamente,<br>Equipe EmpregaJá</p>`;
        break;
      case "rejeicao_perfil":
        titulo = "Perfil Rejeitado";
        mensagem = `Infelizmente seu perfil foi rejeitado. ${detalhes || "Por favor, verifique seus dados."}`;
        emailSubject = "Atualização sobre seu perfil";
        emailHtml = `<h1>Olá, ${nome}</h1><p>Seu perfil não foi aprovado.</p>${detalhes ? `<p><strong>Motivo:</strong> ${detalhes}</p>` : ""}<p>Atenciosamente,<br>Equipe EmpregaJá</p>`;
        break;
      case "aprovacao_empregador":
        titulo = "Cadastro Aprovado ✓";
        mensagem = "Seu cadastro como empregador foi aprovado!";
        emailSubject = "Conta Empregador Aprovada!";
        emailHtml = `<h1>Olá, ${nome}!</h1><p>Seu cadastro foi aprovado!</p><p>Acesse: <a href="https://empregaja.com/perfil-empregador">Painel</a></p><p>Equipe EmpregaJá</p>`;
        break;
      case "rejeicao_empregador":
        titulo = "Cadastro Não Aprovado";
        mensagem = `Seu cadastro não foi aprovado. ${detalhes || ""}`;
        emailSubject = "Atualização cadastro";
        emailHtml = `<h1>Olá, ${nome}</h1><p>Cadastro não aprovado.</p>${detalhes ? `<p>${detalhes}</p>` : ""}<p>Equipe EmpregaJá</p>`;
        break;
      case "aprovacao_curso":
        titulo = "Acesso Liberado ✓";
        mensagem = "Pagamento confirmado! Acesso ao curso liberado.";
        emailSubject = "Acesso ao curso liberado!";
        emailHtml = `<h1>Olá, ${nome}!</h1><p>Pagamento confirmado!</p><p>Acesse: <a href="https://empregaja.com/sala-de-aula">Sala de Aula</a></p><p>Equipe EmpregaJá</p>`;
        break;
      case "rejeicao_curso":
        titulo = "Pagamento Não Confirmado";
        mensagem = `Comprovativo não aprovado. ${detalhes || ""}`;
        emailSubject = "Atualização pagamento";
        emailHtml = `<h1>Olá, ${nome}</h1><p>Pagamento não confirmado.</p>${detalhes ? `<p>${detalhes}</p>` : ""}<p>Equipe EmpregaJá</p>`;
        break;
      case "aprovacao_conta_pro":
        titulo = "Conta Pro Ativada ✓";
        mensagem = "Sua conta Pro foi ativada!";
        emailSubject = "Conta Pro Ativada!";
        emailHtml = `<h1>Olá, ${nome}!</h1><p>Conta Pro ativada! 🌟</p><p>Acesse: <a href="https://empregaja.com/perfil-candidato">Perfil</a></p><p>Equipe EmpregaJá</p>`;
        break;
    }

    await supabase.from("notificacoes_push").insert({
      user_id,
      tipo,
      titulo,
      mensagem,
      lida: false,
    });

    try {
      await resend.emails.send({
        from: "EmpregaJá <noreply@empregaja.com>",
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error("Erro email:", emailErr);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);
