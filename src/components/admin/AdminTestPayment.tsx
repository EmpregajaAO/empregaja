import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, TestTube } from "lucide-react";

export function AdminTestPayment() {
  const [loading, setLoading] = useState(false);
  const [valor, setValor] = useState("5000");
  const [tipoServico, setTipoServico] = useState("perfil_basico");
  const { toast } = useToast();

  const createTestPayment = async () => {
    try {
      setLoading(true);

      // Buscar um candidato aleatório para usar no teste
      const { data: candidatos, error: candidatoError } = await supabase
        .from("candidatos")
        .select("id")
        .limit(1);

      if (candidatoError || !candidatos || candidatos.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhum candidato encontrado para criar comprovativo de teste",
          variant: "destructive",
        });
        return;
      }

      // Criar comprovativo de teste
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .insert({
          candidato_id: candidatos[0].id,
          valor: parseFloat(valor),
          tipo_servico: tipoServico,
          comprovativo_url: `https://via.placeholder.com/600x800/0066cc/ffffff?text=Comprovativo+de+Teste+${tipoServico}`,
          status: "pendente",
          observacoes: "Comprovativo de teste gerado pelo administrador para demonstração",
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comprovativo de teste criado com sucesso!",
      });

      // Recarregar a página para ver o novo comprovativo
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Erro ao criar comprovativo de teste:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar comprovativo de teste",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          <CardTitle>Criar Comprovativo de Teste</CardTitle>
        </div>
        <CardDescription>
          Use esta ferramenta para criar comprovativos de teste e validar o funcionamento do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Serviço</Label>
            <Select value={tipoServico} onValueChange={setTipoServico}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perfil_basico">Perfil Básico (5.000 Kz)</SelectItem>
                <SelectItem value="criacao_perfil">Criação de Perfil (5.000 Kz)</SelectItem>
                <SelectItem value="conta_ativo">Conta Ativo (10.000 Kz)</SelectItem>
                <SelectItem value="perfil_ativo">Perfil Ativo (10.000 Kz)</SelectItem>
                <SelectItem value="conta_pro">Conta PRO (50.000 Kz)</SelectItem>
                <SelectItem value="curso">Curso (15.000 Kz)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (Kz)</Label>
            <Input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="5000"
            />
          </div>
        </div>

        <Button 
          onClick={createTestPayment} 
          disabled={loading}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          {loading ? "Criando..." : "Criar Comprovativo de Teste"}
        </Button>

        <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
          <p className="font-semibold">ℹ️ Como usar:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Selecione o tipo de serviço que deseja testar</li>
            <li>Ajuste o valor se necessário</li>
            <li>Clique em "Criar Comprovativo de Teste"</li>
            <li>O comprovativo aparecerá na lista de pendentes</li>
            <li>Teste os botões de Aprovar e Rejeitar</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
