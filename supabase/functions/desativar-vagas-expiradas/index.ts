import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando desativação de vagas expiradas...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Desativar vagas com data de expiração passada
    const { data: vagasDesativadas, error } = await supabase
      .from('vagas')
      .update({ ativa: false })
      .eq('ativa', true)
      .not('data_expiracao', 'is', null)
      .lt('data_expiracao', new Date().toISOString().split('T')[0])
      .select('id, titulo_vaga, data_expiracao');

    if (error) {
      console.error('Erro ao desativar vagas:', error);
      throw error;
    }

    const quantidadeDesativada = vagasDesativadas?.length || 0;
    console.log(`Vagas desativadas: ${quantidadeDesativada}`);

    if (quantidadeDesativada > 0) {
      console.log('Vagas desativadas:', vagasDesativadas);
    }

    return new Response(
      JSON.stringify({
        success: true,
        vagas_desativadas: quantidadeDesativada,
        vagas: vagasDesativadas,
        mensagem: `${quantidadeDesativada} vagas expiradas foram desativadas.`,
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
