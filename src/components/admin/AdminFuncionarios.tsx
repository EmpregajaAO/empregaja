import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Funcionario {
  id: string;
  perfil_id: string;
  cargo: string;
  salario_base: number;
  data_admissao: string;
  ativo: boolean;
  perfis: {
    nome_completo: string;
    telefone: string;
  };
}

export function AdminFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cargo: "",
    salario_base: "",
    data_admissao: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from("funcionarios")
        .select(`
          *,
          perfis (
            nome_completo,
            telefone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os funcionários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (funcionarioId: string, atualStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("funcionarios")
        .update({ ativo: !atualStatus })
        .eq("id", funcionarioId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Funcionário ${!atualStatus ? "ativado" : "desativado"} com sucesso`,
      });

      loadFuncionarios();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>A carregar funcionários...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestão de Funcionários</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo funcionário da plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  placeholder="Ex: Atendimento, Suporte Técnico"
                />
              </div>
              <div>
                <Label htmlFor="salario">Salário Base (Kz)</Label>
                <Input
                  id="salario"
                  type="number"
                  value={formData.salario_base}
                  onChange={(e) => setFormData({ ...formData, salario_base: e.target.value })}
                  placeholder="Ex: 150000"
                />
              </div>
              <div>
                <Label htmlFor="data">Data de Admissão</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data_admissao}
                  onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                />
              </div>
              <Button className="w-full">Adicionar Funcionário</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Salário Base</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.map((func) => (
              <TableRow key={func.id}>
                <TableCell className="font-medium">
                  {func.perfis?.nome_completo || "N/A"}
                </TableCell>
                <TableCell>{func.cargo}</TableCell>
                <TableCell>{Number(func.salario_base).toLocaleString("pt-AO")} Kz</TableCell>
                <TableCell>
                  {new Date(func.data_admissao).toLocaleDateString("pt-AO")}
                </TableCell>
                <TableCell>
                  {func.ativo ? (
                    <Badge variant="default">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={func.ativo ? "destructive" : "default"}
                    onClick={() => toggleStatus(func.id, func.ativo)}
                  >
                    {func.ativo ? "Desativar" : "Ativar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}