import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ExternalLink, MapPin, Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Vaga {
  id: string;
  titulo_vaga: string;
  empresa: string;
  localidade: string;
  tipo_contrato: string;
  origem: string | null;
  salario_min: number | null;
  salario_max: number | null;
  ativa: boolean;
  data_coleta: string;
  link_origem: string;
  provincias_angola?: { nome: string } | null;
}

export function AdminVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    titulo_vaga: "",
    empresa: "",
    localidade: "",
    tipo_contrato: "",
    descricao: "",
    salario_min: "",
    salario_max: "",
    link_origem: "",
    requisitos: [] as string[],
  });

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = async () => {
    try {
      const { data, error } = await supabase
        .from("vagas")
        .select("*, provincias_angola(nome)")
        .order("data_coleta", { ascending: false })
        .limit(100);

      if (error) throw error;
      setVagas(data || []);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vagas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVagaStatus = async (vagaId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("vagas")
        .update({ ativa: !currentStatus })
        .eq("id", vagaId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Vaga ${!currentStatus ? "ativada" : "desativada"} com sucesso`,
      });

      loadVagas();
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a vaga",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (vaga?: Vaga) => {
    if (vaga) {
      setEditingVaga(vaga);
      setFormData({
        titulo_vaga: vaga.titulo_vaga,
        empresa: vaga.empresa,
        localidade: vaga.localidade,
        tipo_contrato: vaga.tipo_contrato,
        descricao: "",
        salario_min: vaga.salario_min?.toString() || "",
        salario_max: vaga.salario_max?.toString() || "",
        link_origem: vaga.link_origem,
        requisitos: [],
      });
    } else {
      setEditingVaga(null);
      setFormData({
        titulo_vaga: "",
        empresa: "",
        localidade: "",
        tipo_contrato: "",
        descricao: "",
        salario_min: "",
        salario_max: "",
        link_origem: "",
        requisitos: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveVaga = async () => {
    try {
      const vagaData = {
        titulo_vaga: formData.titulo_vaga,
        empresa: formData.empresa,
        localidade: formData.localidade,
        tipo_contrato: formData.tipo_contrato,
        descricao: formData.descricao,
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null,
        link_origem: formData.link_origem || "https://empregaja.ao",
        hash_dedup: `manual_${Date.now()}`,
        requisitos: formData.requisitos.length > 0 ? formData.requisitos : null,
      };

      if (editingVaga) {
        const { error } = await supabase
          .from("vagas")
          .update(vagaData)
          .eq("id", editingVaga.id);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Vaga atualizada com sucesso" });
      } else {
        const { error } = await supabase
          .from("vagas")
          .insert([vagaData]);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Vaga criada com sucesso" });
      }

      setIsDialogOpen(false);
      loadVagas();
    } catch (error) {
      console.error("Erro ao salvar vaga:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a vaga",
        variant: "destructive",
      });
    }
  };

  const deleteVaga = async (vagaId: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta vaga?")) return;

    try {
      const { error } = await supabase
        .from("vagas")
        .delete()
        .eq("id", vagaId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Vaga eliminada com sucesso",
      });

      loadVagas();
    } catch (error) {
      console.error("Erro ao eliminar vaga:", error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a vaga",
        variant: "destructive",
      });
    }
  };

  const formatSalario = (min: number | null, max: number | null) => {
    if (!min && !max) return "A combinar";
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} Kz`;
    if (min) return `A partir de ${min.toLocaleString()} Kz`;
    return `Até ${max?.toLocaleString()} Kz`;
  };

  if (loading) {
    return <div>A carregar vagas...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center justify-between">
              <span>Gestão de Vagas Agregadas</span>
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{vagas.length} vagas</Badge>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Vaga
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Salário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vagas.map((vaga) => (
                <TableRow key={vaga.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {vaga.titulo_vaga}
                  </TableCell>
                  <TableCell>{vaga.empresa}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {vaga.provincias_angola?.nome || vaga.localidade}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      {vaga.tipo_contrato}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {vaga.origem ? (
                      <Badge variant="secondary">{vaga.origem}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatSalario(vaga.salario_min, vaga.salario_max)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={vaga.ativa ? "default" : "secondary"}>
                      {vaga.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={vaga.ativa ? "outline" : "default"}
                        onClick={() => toggleVagaStatus(vaga.id, vaga.ativa)}
                      >
                        {vaga.ativa ? (
                          <><EyeOff className="h-4 w-4" /> Desativar</>
                        ) : (
                          <><Eye className="h-4 w-4" /> Ativar</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(vaga)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                      >
                        <a href={vaga.link_origem} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteVaga(vaga.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingVaga ? "Editar Vaga" : "Adicionar Nova Vaga"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo_vaga">Título da Vaga</Label>
            <Input
              id="titulo_vaga"
              value={formData.titulo_vaga}
              onChange={(e) => setFormData({ ...formData, titulo_vaga: e.target.value })}
              placeholder="Ex: Desenvolvedor Full Stack"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <Label htmlFor="localidade">Localidade</Label>
              <Input
                id="localidade"
                value={formData.localidade}
                onChange={(e) => setFormData({ ...formData, localidade: e.target.value })}
                placeholder="Ex: Luanda"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo_contrato">Tipo de Contrato</Label>
              <Input
                id="tipo_contrato"
                value={formData.tipo_contrato}
                onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value })}
                placeholder="Ex: Tempo Integral"
              />
            </div>
            <div>
              <Label htmlFor="link_origem">Link da Vaga</Label>
              <Input
                id="link_origem"
                value={formData.link_origem}
                onChange={(e) => setFormData({ ...formData, link_origem: e.target.value })}
                placeholder="URL opcional"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salario_min">Salário Mínimo (Kz)</Label>
              <Input
                id="salario_min"
                type="number"
                value={formData.salario_min}
                onChange={(e) => setFormData({ ...formData, salario_min: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="salario_max">Salário Máximo (Kz)</Label>
              <Input
                id="salario_max"
                type="number"
                value={formData.salario_max}
                onChange={(e) => setFormData({ ...formData, salario_max: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição da vaga..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveVaga}>
            {editingVaga ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
