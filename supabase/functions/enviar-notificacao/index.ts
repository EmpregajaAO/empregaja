import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
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

    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Definir conteúdo da notificação baseado no tipo
    let titulo = "";
    let mensagem = "";
    let emailSubject = "";
    let emailHtml = "";

    switch (tipo) {
      case "aprovacao_perfil":
        titulo = "Perfil Aprovado ✓";
        mensagem = "Parabéns! Seu perfil foi aprovado e agora você tem acesso completo à plataforma EmpregaJá.";
        emailSubject = "Seu perfil foi aprovado no EmpregaJá!";
        emailHtml = `
          <h1>Olá, ${nome}!</h1>
          <p>Temos boas notícias! 🎉</p>
          <p><strong>Seu perfil foi aprovado</strong> e agora você pode aproveitar todos os recursos da plataforma EmpregaJá.</p>
          <p>Acesse agora mesmo: <a href="https://empregaja.com">https://empregaja.com</a></p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "rejeicao_perfil":
        titulo = "Perfil Rejeitado";
        mensagem = `Infelizmente seu perfil foi rejeitado. ${detalhes || "Por favor, verifique seus dados e tente novamente."}`;
        emailSubject = "Atualização sobre seu perfil no EmpregaJá";
        emailHtml = `
          <h1>Olá, ${nome}</h1>
          <p>Informamos que seu perfil não foi aprovado neste momento.</p>
          ${detalhes ? `<p><strong>Motivo:</strong> ${detalhes}</p>` : ""}
          <p>Por favor, revise seus dados e envie uma nova solicitação quando estiver pronto.</p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "aprovacao_empregador":
        titulo = "Cadastro de Empregador Aprovado ✓";
        mensagem = "Parabéns! Seu cadastro como empregador foi aprovado. Agora você pode buscar candidatos qualificados.";
        emailSubject = "Bem-vindo ao EmpregaJá - Conta Empregador Aprovada!";
        emailHtml = `
          <h1>Olá, ${nome}!</h1>
          <p>Excelentes notícias! 🎉</p>
          <p><strong>Seu cadastro como empregador foi aprovado!</strong></p>
          <p>Agora você pode:</p>
          <ul>
            <li>Buscar candidatos qualificados</li>
            <li>Visualizar perfis de candidatos Pro</li>
            <li>Agendar entrevistas</li>
            <li>Entrar em contato com talentos</li>
          </ul>
          <p>Acesse seu painel: <a href="https://empregaja.com/perfil-empregador">https://empregaja.com/perfil-empregador</a></p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "rejeicao_empregador":
        titulo = "Cadastro de Empregador Não Aprovado";
        mensagem = `Seu cadastro como empregador não foi aprovado. ${detalhes || "Por favor, verifique seus dados empresariais."}`;
        emailSubject = "Atualização sobre seu cadastro de empregador";
        emailHtml = `
          <h1>Olá, ${nome}</h1>
          <p>Informamos que seu cadastro como empregador não foi aprovado neste momento.</p>
          ${detalhes ? `<p><strong>Motivo:</strong> ${detalhes}</p>` : ""}
          <p>Por favor, revise os dados da sua empresa e tente novamente.</p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "aprovacao_curso":
        titulo = "Pagamento de Curso Aprovado ✓";
        mensagem = "Seu pagamento foi aprovado! Acesse agora seu curso e comece a aprender.";
        emailSubject = "Pagamento aprovado - Acesse seu curso!";
        emailHtml = `
          <h1>Olá, ${nome}!</h1>
          <p>Ótimas notícias! 💳</p>
          <p><strong>Seu pagamento foi aprovado!</strong></p>
          <p>Agora você tem acesso completo ao curso. Comece a aprender agora mesmo!</p>
          <p>Acesse seus cursos: <a href="https://empregaja.com/perfil-candidato">https://empregaja.com/perfil-candidato</a></p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "rejeicao_curso":
        titulo = "Pagamento de Curso Rejeitado";
        mensagem = `Seu pagamento não foi aprovado. ${detalhes || "Por favor, verifique o comprovativo e envie novamente."}`;
        emailSubject = "Atualização sobre seu pagamento de curso";
        emailHtml = `
          <h1>Olá, ${nome}</h1>
          <p>Infelizmente não conseguimos aprovar seu pagamento.</p>
          ${detalhes ? `<p><strong>Motivo:</strong> ${detalhes}</p>` : ""}
          <p>Por favor, verifique o comprovativo de pagamento e envie novamente.</p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;

      case "aprovacao_conta_pro":
        titulo = "Conta Pro Ativada ✓";
        mensagem = "Parabéns! Seu pagamento foi aprovado e sua conta Pro está ativa. Agora empregadores podem visualizar seu perfil!";
        emailSubject = "Conta Pro ativada - Destaque-se para empregadores!";
        emailHtml = `
          <h1>Olá, ${nome}!</h1>
          <p>Fantástico! 🌟</p>
          <p><strong>Sua conta Pro foi ativada com sucesso!</strong></p>
          <p>Agora você tem:</p>
          <ul>
            <li>Perfil destacado para empregadores</li>
            <li>Maior visibilidade no sistema</li>
            <li>Prioridade nas buscas</li>
            <li>Contato direto com empresas</li>
          </ul>
          <p>Mantenha seu perfil atualizado para maximizar suas chances!</p>
          <p>Acesse: <a href="https://empregaja.com/perfil-candidato">https://empregaja.com/perfil-candidato</a></p>
          <p>Atenciosamente,<br>Equipe EmpregaJá</p>
        `;
        break;
    }

    // Inserir notificação push no banco
    const { error: pushError } = await supabase
      .from("notificacoes_push")
      .insert({
        user_id,
        tipo,
        titulo,
        mensagem,
        metadados: { detalhes },
      });

    if (pushError) {
      console.error("Erro ao inserir notificação push:", pushError);
    }

    // Enviar email
    const { error: emailError } = await resend.emails.send({
      from: "EmpregaJá <onboarding@resend.dev>",
      to: [email],
      subject: emailSubject,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Erro ao enviar email:", emailError);
      throw emailError;
    }

    console.log("Notificação enviada com sucesso para:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Notificação enviada com sucesso" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar notificação:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
