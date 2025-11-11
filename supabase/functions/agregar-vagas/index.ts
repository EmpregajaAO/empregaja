import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VagaRaw {
  titulo: string;
  empresa: string;
  localidade: string;
  provincia?: string;
  descricao: string;
  requisitos?: string[];
  tipo_contrato: string;
  salario_min?: number;
  salario_max?: number;
  link_origem: string;
  data_publicacao?: string;
  canais_contato?: Record<string, string>;
}

interface ResultadoColeta {
  fonte_id: string;
  fonte_nome: string;
  vagas_novas: number;
  vagas_atualizadas: number;
  vagas_duplicadas: number;
  erros: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();
    const { fonte_id } = await req.json();

    console.log(`[AGREGAÇÃO] Iniciando coleta${fonte_id ? ` para fonte ${fonte_id}` : ' para todas as fontes ativas'}`);

    // Buscar fontes ativas
    const { data: fontes, error: fontesError } = await supabaseClient
      .from('fontes_vagas')
      .select('*')
      .eq('ativa', true)
      .or(fonte_id ? `id.eq.${fonte_id}` : 'proxima_coleta.lte.now(),proxima_coleta.is.null');

    if (fontesError) {
      throw new Error(`Erro ao buscar fontes: ${fontesError.message}`);
    }

    if (!fontes || fontes.length === 0) {
      console.log('[AGREGAÇÃO] Nenhuma fonte disponível para coleta');
      return new Response(
        JSON.stringify({ 
          sucesso: true, 
          mensagem: 'Nenhuma fonte disponível para coleta',
          resultados: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resultados: ResultadoColeta[] = [];

    // Processar cada fonte
    for (const fonte of fontes) {
      console.log(`[FONTE: ${fonte.nome}] Iniciando coleta`);
      const inicioFonte = Date.now();
      
      const resultado: ResultadoColeta = {
        fonte_id: fonte.id,
        fonte_nome: fonte.nome,
        vagas_novas: 0,
        vagas_atualizadas: 0,
        vagas_duplicadas: 0,
        erros: []
      };

      try {
        let vagasColetadas: VagaRaw[] = [];

        // Coletar vagas baseado no tipo de fonte
        switch (fonte.tipo) {
          case 'RSS':
            vagasColetadas = await coletarDeRSS(fonte.url, fonte.configuracao);
            break;
          case 'API':
            vagasColetadas = await coletarDeAPI(fonte.url, fonte.configuracao);
            break;
          case 'SCRAPER':
            vagasColetadas = await coletarDeScraper(fonte.url, fonte.configuracao);
            break;
          default:
            resultado.erros.push(`Tipo de fonte não suportado: ${fonte.tipo}`);
        }

        console.log(`[FONTE: ${fonte.nome}] ${vagasColetadas.length} vagas coletadas`);

        // Buscar mapa de províncias
        const { data: provincias } = await supabaseClient
          .from('provincias_angola')
          .select('id, nome');

        const provinciaMap = new Map(
          provincias?.map(p => [p.nome.toLowerCase(), p.id]) || []
        );

        // Processar cada vaga coletada
        for (const vagaRaw of vagasColetadas) {
          try {
            // Normalizar província
            const provincia_id = normalizarProvincia(vagaRaw.provincia || vagaRaw.localidade, provinciaMap);
            
            if (!provincia_id) {
              resultado.erros.push(`Província não encontrada para: ${vagaRaw.localidade}`);
              continue;
            }

            // Gerar hash de deduplicação
            const hash = await gerarHash(vagaRaw.titulo, vagaRaw.empresa, vagaRaw.localidade);

            // Verificar se já existe
            const { data: vagaExistente } = await supabaseClient
              .from('vagas')
              .select('id')
              .eq('hash_dedup', hash)
              .maybeSingle();

            if (vagaExistente) {
              // Adicionar fonte à vaga existente
              const { error: relacaoError } = await supabaseClient
                .from('vagas_fontes')
                .upsert({
                  vaga_id: vagaExistente.id,
                  fonte_id: fonte.id,
                  data_coleta: new Date().toISOString()
                }, { onConflict: 'vaga_id,fonte_id' });

              if (!relacaoError) {
                resultado.vagas_duplicadas++;
              }
              continue;
            }

            // Inserir nova vaga
            const { data: novaVaga, error: insertError } = await supabaseClient
              .from('vagas')
              .insert({
                titulo_vaga: vagaRaw.titulo,
                empresa: vagaRaw.empresa,
                provincia_id,
                localidade: vagaRaw.localidade,
                descricao: vagaRaw.descricao,
                requisitos: vagaRaw.requisitos || [],
                tipo_contrato: normalizarTipoContrato(vagaRaw.tipo_contrato),
                salario_min: vagaRaw.salario_min,
                salario_max: vagaRaw.salario_max,
                link_origem: vagaRaw.link_origem,
                data_publicacao_origem: vagaRaw.data_publicacao || new Date().toISOString(),
                canais_contato: vagaRaw.canais_contato || {},
                hash_dedup: hash
              })
              .select('id')
              .single();

            if (insertError) {
              resultado.erros.push(`Erro ao inserir vaga "${vagaRaw.titulo}": ${insertError.message}`);
              continue;
            }

            // Criar relação vaga-fonte
            await supabaseClient
              .from('vagas_fontes')
              .insert({
                vaga_id: novaVaga.id,
                fonte_id: fonte.id
              });

            resultado.vagas_novas++;

          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
            resultado.erros.push(`Erro ao processar vaga: ${errorMsg}`);
          }
        }

        // Atualizar próxima coleta da fonte
        const proximaColeta = new Date();
        proximaColeta.setMinutes(proximaColeta.getMinutes() + fonte.frequencia_minutos);

        await supabaseClient
          .from('fontes_vagas')
          .update({
            ultima_coleta: new Date().toISOString(),
            proxima_coleta: proximaColeta.toISOString()
          })
          .eq('id', fonte.id);

        // Registrar log de coleta
        await supabaseClient
          .from('logs_coleta')
          .insert({
            fonte_id: fonte.id,
            status: resultado.erros.length > 0 ? 'parcial' : 'sucesso',
            vagas_novas: resultado.vagas_novas,
            vagas_atualizadas: resultado.vagas_atualizadas,
            vagas_duplicadas: resultado.vagas_duplicadas,
            tempo_resposta_ms: Date.now() - inicioFonte,
            mensagem_erro: resultado.erros.length > 0 ? resultado.erros.join('; ') : null,
            detalhes: { total_coletadas: vagasColetadas.length }
          });

        console.log(`[FONTE: ${fonte.nome}] Concluído - Novas: ${resultado.vagas_novas}, Duplicadas: ${resultado.vagas_duplicadas}`);

      } catch (error) {
        console.error(`[FONTE: ${fonte.nome}] Erro:`, error);
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        resultado.erros.push(errorMsg);

        await supabaseClient
          .from('logs_coleta')
          .insert({
            fonte_id: fonte.id,
            status: 'erro',
            tempo_resposta_ms: Date.now() - inicioFonte,
            mensagem_erro: errorMsg
          });
      }

      resultados.push(resultado);
    }

    const tempoTotal = Date.now() - startTime;
    const resumo = {
      sucesso: true,
      tempo_total_ms: tempoTotal,
      fontes_processadas: resultados.length,
      total_vagas_novas: resultados.reduce((sum, r) => sum + r.vagas_novas, 0),
      total_vagas_duplicadas: resultados.reduce((sum, r) => sum + r.vagas_duplicadas, 0),
      resultados
    };

    console.log('[AGREGAÇÃO] Concluída:', resumo);

    return new Response(
      JSON.stringify(resumo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[AGREGAÇÃO] Erro fatal:', error);
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ sucesso: false, erro: errorMsg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Funções auxiliares

function normalizarProvincia(texto: string, provinciaMap: Map<string, string>): string | null {
  const textoNorm = texto.toLowerCase().trim();
  
  // Tentar match exato
  if (provinciaMap.has(textoNorm)) {
    return provinciaMap.get(textoNorm)!;
  }
  
  // Tentar match parcial
  for (const [nome, id] of provinciaMap.entries()) {
    if (textoNorm.includes(nome) || nome.includes(textoNorm)) {
      return id;
    }
  }
  
  return null;
}

function normalizarTipoContrato(tipo: string): string {
  const tipoLower = tipo.toLowerCase();
  
  if (tipoLower.includes('integral') || tipoLower.includes('inteiro') || tipoLower.includes('full')) {
    return 'Tempo inteiro';
  }
  if (tipoLower.includes('parcial') || tipoLower.includes('part')) {
    return 'Parcial';
  }
  if (tipoLower.includes('estágio') || tipoLower.includes('estagio') || tipoLower.includes('intern')) {
    return 'Estagio';
  }
  if (tipoLower.includes('temporário') || tipoLower.includes('temporario') || tipoLower.includes('temp')) {
    return 'Temporário';
  }
  if (tipoLower.includes('freelance') || tipoLower.includes('freela')) {
    return 'Freelance';
  }
  
  return 'Tempo inteiro'; // Default
}

async function gerarHash(titulo: string, empresa: string, localidade: string): Promise<string> {
  const texto = `${titulo.toLowerCase().trim()}|${empresa.toLowerCase().trim()}|${localidade.toLowerCase().trim()}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function coletarDeRSS(url: string, config: any): Promise<VagaRaw[]> {
  console.log(`[RSS] Coletando de: ${url}`);
  // TODO: Implementar parser RSS
  return [];
}

async function coletarDeAPI(url: string, config: any): Promise<VagaRaw[]> {
  console.log(`[API] Coletando de: ${url}`);
  
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'EmpregaJa-Aggregator/1.0',
      'Accept': 'application/json'
    };
    
    if (config.api_key) {
      headers['Authorization'] = `Bearer ${config.api_key}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // TODO: Mapear resposta da API para formato VagaRaw
    // Isso dependerá da estrutura de cada API
    
    return [];
  } catch (error) {
    console.error(`[API] Erro ao coletar de ${url}:`, error);
    throw error;
  }
}

async function coletarDeScraper(url: string, config: any): Promise<VagaRaw[]> {
  console.log(`[SCRAPER] Coletando de: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EmpregaJa-Aggregator/1.0 (+https://empregaja.ao)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // TODO: Implementar parsing HTML baseado em seletores CSS
    // Usar config.selectors para extrair dados
    
    return [];
  } catch (error) {
    console.error(`[SCRAPER] Erro ao coletar de ${url}:`, error);
    throw error;
  }
}
