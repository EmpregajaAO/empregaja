import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, candidatoId, tipoServico, valor } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não está configurada");
    }

    console.log("Processando comprovativo de pagamento com OCR");

    // Usar Lovable AI (Gemini) para OCR e extração de dados
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
            content: "És um assistente especializado em extrair informações de comprovativos de pagamento em Angola. Extrai: nome do banco, número de referência, valor, data, hora, e qualquer outra informação relevante. Responde apenas em formato JSON." 
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extrai as informações deste comprovativo de pagamento. Retorna um JSON com os campos: banco, referencia, valor, moeda, data, hora, nome_pagador (se visível), outras_informacoes.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API de OCR:", response.status, errorText);
      throw new Error("Erro ao processar comprovativo com OCR");
    }

    const data = await response.json();
    const ocrResult = data.choices?.[0]?.message?.content;
    
    let dadosOcr;
    try {
      dadosOcr = JSON.parse(ocrResult);
    } catch {
      dadosOcr = { texto_extraido: ocrResult };
    }

    console.log("Dados extraídos:", dadosOcr);

    // Criar cliente Supabase para salvar o comprovativo
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Salvar comprovativo na base de dados
    const { data: comprovativo, error: comprovantivoError } = await supabase
      .from('comprovativos_pagamento')
      .insert({
        candidato_id: candidatoId,
        tipo_servico: tipoServico,
        valor: valor,
        comprovativo_url: imageBase64,
        dados_ocr: dadosOcr,
        status: 'pendente'
      })
      .select()
      .single();

    if (comprovantivoError) {
      console.error("Erro ao salvar comprovativo:", comprovantivoError);
      throw comprovantivoError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      comprovativo,
      dadosOcr 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro no processamento de comprovativo:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
