import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VagaInput {
  titulo: string;
  empresa: string;
  localidade: string;
  provincia: string;
  tipo_contrato: string;
  descricao: string;
  requisitos: string[];
  dias_restantes: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { vagas }: { vagas: VagaInput[] } = await req.json();

    if (!vagas || !Array.isArray(vagas)) {
      return new Response(
        JSON.stringify({ error: 'Array de vagas é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const vagasInseridas = [];
    const erros = [];

    for (const vaga of vagas) {
      try {
        // Buscar província
        const { data: provincia } = await supabase
          .from('provincias_angola')
          .select('id')
          .eq('nome', vaga.provincia)
          .single();

        // Calcular data de expiração
        const dataExpiracao = new Date();
        dataExpiracao.setDate(dataExpiracao.getDate() + vaga.dias_restantes);

        // Gerar hash usando MD5
        const hashInput = `${vaga.titulo.toLowerCase().trim()}|${vaga.empresa.toLowerCase().trim()}|${vaga.localidade.toLowerCase().trim()}`;
        
        // Inserir vaga
        const { data, error } = await supabase
          .from('vagas')
          .insert({
            titulo_vaga: vaga.titulo,
            empresa: vaga.empresa,
            localidade: vaga.localidade,
            provincia_id: provincia?.id || null,
            tipo_contrato: vaga.tipo_contrato,
            descricao: vaga.descricao,
            requisitos: vaga.requisitos,
            data_expiracao: dataExpiracao.toISOString().split('T')[0],
            hash_dedup: await crypto.subtle.digest('MD5', new TextEncoder().encode(hashInput))
              .then(buf => Array.from(new Uint8Array(buf))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')),
            link_origem: 'https://www.emprego.co.ao',
            origem: 'Emprego.co.ao',
            ativa: true
          })
          .select()
          .single();

        if (error) {
          erros.push({ vaga: vaga.titulo, erro: error.message });
        } else {
          vagasInseridas.push(data);
        }
      } catch (error) {
        erros.push({ vaga: vaga.titulo, erro: String(error) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        vagas_inseridas: vagasInseridas.length,
        erros: erros.length > 0 ? erros : undefined,
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
