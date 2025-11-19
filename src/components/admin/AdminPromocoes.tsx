import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Eye, EyeOff, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Promocao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  data_envio: string;
  metadados: any;
}

export function AdminPromocoes() {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPromocoes();
  }, []);

  const loadPromocoes = async () => {
    try {
      const { data, error } = await supabase
        .from("notificacoes_push")
        .select("*")
        .eq("tipo", "promocao")
        .order("data_envio", { ascending: false });

      if (error) throw error;
      setPromocoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as promoções",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const criarPromocao = async () => {
    if (!titulo || !mensagem) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("notificacoes_push")
        .insert({
          titulo,
          mensagem,
          tipo: "promocao",
          lida: false,
          metadados: { broadcast: true }
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Promoção criada com sucesso",
      });

      setTitulo("");
      setMensagem("");
      setOpen(false);
      loadPromocoes();
    } catch (error) {
      console.error("Erro ao criar promoção:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a promoção",
        variant: "destructive",
      });
    }
  };

  const deletarPromocao = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notificacoes_push")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Promoção deletada com sucesso",
      });

      loadPromocoes();
    } catch (error) {
      console.error("Erro ao deletar promoção:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a promoção",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>A carregar promoções...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gestão de Promoções</span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Promoção
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Promoção</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Desconto de 20% em todos os cursos"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Descreva os detalhes da promoção..."
                    rows={4}
                  />
                </div>
                <Button onClick={criarPromocao} className="w-full">
                  Criar Promoção
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data de Envio</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promocoes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.titulo}</TableCell>
                  <TableCell className="max-w-md truncate">{promo.mensagem}</TableCell>
                  <TableCell>
                    {new Date(promo.data_envio).toLocaleDateString('pt-AO')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletarPromocao(promo.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
