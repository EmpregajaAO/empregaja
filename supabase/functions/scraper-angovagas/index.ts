import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0';
import { DOMParser, Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VagaRaw {
  titulo: string;
  empresa: string;
  descricao: string;
  link: string;
  email?: string;
  localidade: string;
  tipo_contrato: string;
  diasAtras: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando scraping do AngoVagas...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const vagas = await scrapeAngoVagas();
    console.log(`Vagas coletadas: ${vagas.length}`);

    const { data: provincias } = await supabase
      .from('provincias_angola')
      .select('id, nome');
    
    const provinciaMap = new Map(
      (provincias || []).map(p => [p.nome.toLowerCase(), p.id])
    );

    let novas = 0;
    let duplicadas = 0;

    for (const vaga of vagas) {
      const hashText = `${vaga.titulo}-${vaga.empresa}-${vaga.localidade}`;
      const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(hashText.toLowerCase())
      );
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const { data: existente } = await supabase
        .from('vagas')
        .select('id')
        .eq('hash_dedup', hash)
        .maybeSingle();

      if (existente) {
        duplicadas++;
        continue;
      }

      const provinciaId = normalizarProvincia(vaga.localidade, provinciaMap);

      const { error } = await supabase.from('vagas').insert({
        titulo_vaga: vaga.titulo,
        empresa: vaga.empresa,
        descricao: vaga.descricao,
        localidade: vaga.localidade,
        tipo_contrato: vaga.tipo_contrato,
        provincia_id: provinciaId,
        link_origem: vaga.link,
        origem: 'AngoVagas',
        hash_dedup: hash,
        data_coleta: new Date().toISOString(),
        ativa: true,
        canais_contato: vaga.email ? { email: vaga.email } : {},
      });

      if (!error) novas++;
    }

    console.log(`Concluído: ${novas} novas, ${duplicadas} duplicadas`);

    return new Response(
      JSON.stringify({
        success: true,
        vagas_coletadas: vagas.length,
        vagas_novas: novas,
        vagas_duplicadas: duplicadas,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function scrapeAngoVagas(): Promise<VagaRaw[]> {
  const MAX_DAYS = 7;
  const baseURL = "https://angovagas.net/";
  const result: VagaRaw[] = [];

  try {
    const response = await fetch(baseURL);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    
    if (!doc) throw new Error("Falha ao parsear HTML");

    const jobListings = doc.querySelectorAll(".job-listing, .job-item, article.job");
    
    for (const node of jobListings) {
      try {
        const el = node as Element;
        
        const titleEl = el.querySelector(".job-title a, h2 a, .title a") as Element | null;
        const title = titleEl?.textContent?.trim() || "";
        const link = titleEl?.getAttribute("href") || "";
        
        const companyEl = el.querySelector(".job-company, .company, .company-name") as Element | null;
        const company = companyEl?.textContent?.trim() || "Não especificada";
        
        const dateEl = el.querySelector(".job-date, .date, .posted-date") as Element | null;
        const dateText = dateEl?.textContent?.trim() || "";
        
        if (!dateText.toLowerCase().includes("dia")) continue;
        
        const daysMatch = dateText.match(/(\d+)/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 999;
        
        if (days > MAX_DAYS) continue;

        const locationEl = el.querySelector(".job-location, .location") as Element | null;
        const localidade = locationEl?.textContent?.trim() || "Luanda";
        
        const typeEl = el.querySelector(".job-type, .type") as Element | null;
        const tipo_contrato = typeEl?.textContent?.trim() || "Tempo Integral";

        let descricao = "";
        let email = "";
        
        if (link && link.startsWith("http")) {
          try {
            const detailResponse = await fetch(link);
            const detailHtml = await detailResponse.text();
            const detailDoc = new DOMParser().parseFromString(detailHtml, "text/html");
            
            if (detailDoc) {
              const descEl = detailDoc.querySelector(".job-description, .description, .content") as Element | null;
              descricao = descEl?.textContent?.trim() || "";
              
              const emailEl = detailDoc.querySelector("a[href^='mailto:']") as Element | null;
              email = emailEl?.getAttribute("href")?.replace("mailto:", "") || "";
            }
          } catch (err) {
            console.error(`Erro detalhes ${link}:`, err);
          }
        }

        if (title) {
          result.push({
            titulo: title,
            empresa: company,
            descricao: descricao || `Vaga de ${title} na empresa ${company}`,
            link: link.startsWith("http") ? link : baseURL + link,
            email,
            localidade,
            tipo_contrato: normalizarTipoContrato(tipo_contrato),
            diasAtras: days,
          });
        }
      } catch (err) {
        console.error("Erro processar listagem:", err);
      }
    }

    return result;

  } catch (error) {
    console.error("Erro scraping:", error);
    return [];
  }
}

function normalizarProvincia(texto: string, provinciaMap: Map<string, string>): string | null {
  const textoLower = texto.toLowerCase();
  
  for (const [nome, id] of provinciaMap.entries()) {
    if (textoLower.includes(nome)) return id;
  }
  
  return provinciaMap.get('luanda') || null;
}

function normalizarTipoContrato(tipo: string): string {
  const tipoLower = tipo.toLowerCase();
  
  if (tipoLower.includes('integral') || tipoLower.includes('full')) return 'Tempo Integral';
  if (tipoLower.includes('parcial') || tipoLower.includes('part')) return 'Meio Período';
  if (tipoLower.includes('estágio') || tipoLower.includes('estagio')) return 'Estágio';
  if (tipoLower.includes('freelance') || tipoLower.includes('temporário')) return 'Freelance';
  
  return 'Tempo Integral';
}
