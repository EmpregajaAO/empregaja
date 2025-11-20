import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminInserirVagas = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const vagas = [
    { titulo: "Candidato", empresa: "Felícia Abel Eduardo Malengue", localidade: "Luanda", provincia: "Luanda", tipo: "Contrato de serviços", desc: "2 anos de experiência exigido. Disponível para trabalho em Informática e TI.", req: ["2 anos de experiência", "Informática e TI"], dias: 33 },
    { titulo: "Gerente SSTMA", empresa: "Indústria Transformadora", localidade: "Malange", provincia: "Malanje", tipo: "Tempo indeterminado", desc: "Garante implementação de processos de segurança, saúde e meio ambiente.", req: ["10 anos de experiência", "QHSE"], dias: 61 },
    { titulo: "Coordenador de Produção", empresa: "Empresa líder Indústria", localidade: "Viana", provincia: "Luanda", tipo: "Tempo indeterminado", desc: "Elaborar e monitorizar planos de produção no ERP.", req: ["3 anos de experiência", "Engenharia"], dias: 60 },
    { titulo: "Analista Pré-Venda Fortinet", empresa: "Empresa Tecnologia", localidade: "Luanda", provincia: "Luanda", tipo: "Tempo indeterminado", desc: "Apoiar vendas na elaboração de propostas técnicas.", req: ["5 anos de experiência", "TI"], dias: 32 },
    { titulo: "Secretário Executivo", empresa: "grup aq didakos", localidade: "Rangel", provincia: "Luanda", tipo: "Tempo integral", desc: "Gestão administrativa e apoio executivo.", req: ["4 anos de experiência", "Administração"], dias: 31 },
    { titulo: "Logístico", empresa: "Empresa Logística", localidade: "Viana", provincia: "Luanda", tipo: "Tempo indeterminado", desc: "Trabalho como conferente e gestão de armazém.", req: ["2 anos de experiência", "Logística"], dias: 31 },
    { titulo: "Formador Reparação Impressoras", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar diagnóstico e manutenção de impressoras.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Programação Mobile", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar desenvolvimento Android/iOS.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Programação Web", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar HTML, CSS, JavaScript.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Fibra Óptica", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar fusão e conectorização.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Redes Computadores", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar configuração de redes.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Eletrónica", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar circuitos analógicos e digitais.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Design Gráfico", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar Photoshop e Illustrator.", req: ["2 anos de experiência"], dias: 59 },
    { titulo: "Técnico SAP Cliente", empresa: "KEPT PEOPLE", localidade: "Luanda", provincia: "Luanda", tipo: "Tempo indeterminado", desc: "Atendimento e gestão SAP.", req: ["5 anos de experiência"], dias: 31 },
    { titulo: "Formador CCTV", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar instalação CCTV.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Inglês Técnico", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar inglês Oil Gas.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador HST", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar segurança no trabalho.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Rigger", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar movimentação de cargas.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Tubista", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar montagem tubagens.", req: ["2 anos de experiência"], dias: 31 },
    { titulo: "Formador Soldadura TIG", empresa: "Kiazop", localidade: "Luanda", provincia: "Luanda", tipo: "A definir", desc: "Ensinar soldadura TIG.", req: ["2 anos de experiência"], dias: 31 },
  ];

  const inserirVagas = async () => {
    setLoading(true);
    try {
      // Buscar províncias
      const { data: provincias } = await supabase
        .from("provincias_angola")
        .select("id, nome");

      const provinciaMap = new Map(provincias?.map(p => [p.nome, p.id]) || []);

      let inseridas = 0;
      let erros = 0;

      for (const vaga of vagas) {
        try {
          const provinciaId = provinciaMap.get(vaga.provincia);
          const hoje = new Date();
          const dataExpiracao = new Date(hoje);
          dataExpiracao.setDate(dataExpiracao.getDate() + vaga.dias);

          // Gerar hash simples
          const hashInput = `${vaga.titulo.toLowerCase()}|${vaga.empresa.toLowerCase()}|${vaga.localidade.toLowerCase()}`;
          const hash = btoa(hashInput).substring(0, 32);

          const { error } = await supabase
            .from("vagas")
            .insert({
              titulo_vaga: vaga.titulo,
              empresa: vaga.empresa,
              localidade: vaga.localidade,
              provincia_id: provinciaId,
              tipo_contrato: vaga.tipo,
              descricao: vaga.desc,
              requisitos: vaga.req,
              data_expiracao: dataExpiracao.toISOString().split('T')[0],
              hash_dedup: hash,
              link_origem: "https://www.emprego.co.ao",
              origem: "Emprego.co.ao",
              ativa: true,
            });

          if (error) {
            console.error(`Erro ao inserir ${vaga.titulo}:`, error);
            erros++;
          } else {
            inseridas++;
          }
        } catch (err) {
          console.error(`Erro ao processar ${vaga.titulo}:`, err);
          erros++;
        }
      }

      toast({
        title: "Vagas inseridas!",
        description: `${inseridas} vagas inseridas com sucesso${erros > 0 ? `, ${erros} erros` : ''}`,
      });

    } catch (error: any) {
      toast({
        title: "Erro ao inserir vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Inserir Vagas Manualmente</CardTitle>
            <CardDescription>
              Clique no botão abaixo para inserir automaticamente as 20 vagas do Emprego.co.ao
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Vagas a serem inseridas:</h3>
              <ul className="text-sm space-y-1">
                <li>• {vagas.length} vagas de diferentes empresas</li>
                <li>• Com datas de expiração variando de 31 a 61 dias</li>
                <li>• Fonte: Emprego.co.ao</li>
              </ul>
            </div>

            <Button 
              onClick={inserirVagas} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A inserir vagas...
                </>
              ) : (
                "Inserir 20 Vagas Automaticamente"
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              As vagas aparecerão imediatamente na página de Vagas Agregadas
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminInserirVagas;
