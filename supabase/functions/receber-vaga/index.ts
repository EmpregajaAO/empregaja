import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VagaInput {
  titulo: string;
  empresa: string;
  local: string;
  data: string;
  descricao: string;
  link: string;
  origem: string;
  external_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('📥 Recebendo requisição de vaga...');

    // Parse the request body
    const { data: vagaData } = await req.json() as { data: VagaInput };

    if (!vagaData) {
      throw new Error('Dados da vaga não fornecidos');
    }

    // Validar campos obrigatórios
    const requiredFields = ['titulo', 'empresa', 'local', 'data', 'descricao', 'link', 'origem', 'external_id'];
    for (const field of requiredFields) {
      if (!vagaData[field as keyof VagaInput]) {
        throw new Error(`Campo obrigatório ausente: ${field}`);
      }
    }

    console.log('✅ Dados validados:', {
      titulo: vagaData.titulo,
      empresa: vagaData.empresa,
      origem: vagaData.origem,
      external_id: vagaData.external_id
    });

    // Verificar se a vaga já existe (por external_id)
    const { data: existingVaga, error: checkError } = await supabase
      .from('vagas')
      .select('id')
      .eq('external_id', vagaData.external_id)
      .maybeSingle();

    if (checkError) {
      console.error('❌ Erro ao verificar vaga existente:', checkError);
      throw checkError;
    }

    if (existingVaga) {
      console.log('⚠️ Vaga já existe com external_id:', vagaData.external_id);
      
      // Atualizar vaga existente
      const { data: updatedVaga, error: updateError } = await supabase
        .from('vagas')
        .update({
          titulo_vaga: vagaData.titulo,
          empresa: vagaData.empresa,
          localidade: vagaData.local,
          data_publicacao_origem: vagaData.data,
          descricao: vagaData.descricao,
          link_origem: vagaData.link,
          origem: vagaData.origem,
          tipo_contrato: 'Não especificado',
          hash_dedup: vagaData.external_id,
          updated_at: new Date().toISOString()
        })
        .eq('external_id', vagaData.external_id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar vaga:', updateError);
        throw updateError;
      }

      console.log('✅ Vaga atualizada:', updatedVaga.id);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Vaga atualizada com sucesso',
          vaga_id: updatedVaga.id,
          action: 'updated'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Inserir nova vaga
    const { data: newVaga, error: insertError } = await supabase
      .from('vagas')
      .insert({
        titulo_vaga: vagaData.titulo,
        empresa: vagaData.empresa,
        localidade: vagaData.local,
        data_publicacao_origem: vagaData.data,
        descricao: vagaData.descricao,
        link_origem: vagaData.link,
        origem: vagaData.origem,
        external_id: vagaData.external_id,
        tipo_contrato: 'Não especificado',
        hash_dedup: vagaData.external_id,
        ativa: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir vaga:', insertError);
      throw insertError;
    }

    console.log('✅ Nova vaga criada:', newVaga.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vaga criada com sucesso',
        vaga_id: newVaga.id,
        action: 'created'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    );

  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar vaga';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
