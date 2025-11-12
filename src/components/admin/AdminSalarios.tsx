import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Salario {
  id: string;
  funcionario_id: string;
  mes: number;
  ano: number;
  valor: number;
  bonificacoes: number;
  deducoes: number;
  valor_liquido: number;
  data_pagamento: string | null;
  status: string;
  observacoes: string | null;
  funcionarios: {
    cargo: string;
    perfis: {
      nome_completo: string;
    };
  };
}

export function AdminSalarios() {
  const [salarios, setSalarios] = useState<Salario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesFilter, setMesFilter] = useState(new Date().getMonth() + 1);
  const [anoFilter, setAnoFilter] = useState(new Date().getFullYear());
  const { toast } = useToast();

  useEffect(() => {
    loadSalarios();
  }, [mesFilter, anoFilter]);

  const loadSalarios = async () => {
    try {
      let query = supabase
        .from("salarios")
        .select(`
          *,
          funcionarios (
            cargo,
            perfis (
              nome_completo
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (mesFilter) {
        query = query.eq("mes", mesFilter);
      }
      if (anoFilter) {
        query = query.eq("ano", anoFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSalarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar salários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os salários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const marcarComoPago = async (salarioId: string) => {
    try {
      const { error } = await supabase
        .from("salarios")
        .update({
          status: "pago",
          data_pagamento: new Date().toISOString(),
        })
        .eq("id", salarioId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Salário marcado como pago",
      });

      loadSalarios();
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "pago":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Pago</Badge>;
      case "cancelado":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  if (loading) {
    return <div>A carregar salários...</div>;
  }

  const totalPendente = salarios
    .filter(s => s.status === "pendente")
    .reduce((sum, s) => sum + Number(s.valor_liquido), 0);

  const totalPago = salarios
    .filter(s => s.status === "pago")
    .reduce((sum, s) => sum + Number(s.valor_liquido), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendente.toLocaleString("pt-AO")} Kz</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPago.toLocaleString("pt-AO")} Kz</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestão de Salários</CardTitle>
            <div className="flex gap-2">
              <Select
                value={mesFilter.toString()}
                onValueChange={(v) => setMesFilter(Number(v))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {meses.map((mes, idx) => (
                    <SelectItem key={idx} value={(idx + 1).toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={anoFilter.toString()}
                onValueChange={(v) => setAnoFilter(Number(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor Base</TableHead>
                <TableHead>Bonificações</TableHead>
                <TableHead>Deduções</TableHead>
                <TableHead>Valor Líquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salarios.map((salario) => (
                <TableRow key={salario.id}>
                  <TableCell className="font-medium">
                    {salario.funcionarios?.perfis?.nome_completo || "N/A"}
                  </TableCell>
                  <TableCell>{salario.funcionarios?.cargo || "N/A"}</TableCell>
                  <TableCell>
                    {meses[salario.mes - 1]} {salario.ano}
                  </TableCell>
                  <TableCell>{Number(salario.valor).toLocaleString("pt-AO")} Kz</TableCell>
                  <TableCell className="text-green-600">
                    +{Number(salario.bonificacoes).toLocaleString("pt-AO")} Kz
                  </TableCell>
                  <TableCell className="text-red-600">
                    -{Number(salario.deducoes).toLocaleString("pt-AO")} Kz
                  </TableCell>
                  <TableCell className="font-bold">
                    {Number(salario.valor_liquido).toLocaleString("pt-AO")} Kz
                  </TableCell>
                  <TableCell>{getStatusBadge(salario.status)}</TableCell>
                  <TableCell>
                    {salario.status === "pendente" && (
                      <Button
                        size="sm"
                        onClick={() => marcarComoPago(salario.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Marcar como Pago
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}