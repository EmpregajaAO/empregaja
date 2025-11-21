import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, ExternalLink, Eye, Search, Filter, DollarSign, Users, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminTestPayment } from "./AdminTestPayment";

interface Comprovativo {
  id: string;
  valor: number;
  tipo_servico: string;
  status: string;
  comprovativo_url: string;
  observacoes: string | null;
  created_at: string;
  dados_ocr: any;
  candidato_id: string;
  candidatos: {
    perfis: {
      nome_completo: string;
      telefone: string;
      user_id: string;
    };
  };
}

interface Stats {
  total: number;
  pendente: number;
  aprovado: number;
  rejeitado: number;
  valorTotal: number;
}

export function AdminComprovativos() {
  const [comprovativos, setComprovativos] = useState<Comprovativo[]>([]);
  const [filteredComprovativos, setFilteredComprovativos] = useState<Comprovativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedComprovativo, setSelectedComprovativo] = useState<Comprovativo | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [comprovantivoToReject, setComprovantivoToReject] = useState<{ id: string; tipo: string } | null>(null);
  const [stats, setStats] = useState<Stats>({ total: 0, pendente: 0, aprovado: 0, rejeitado: 0, valorTotal: 0 });
  const { toast } = useToast();

  useEffect(() => {
    loadComprovativos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [comprovativos, filterStatus, searchTerm]);

  const loadComprovativos = async () => {
    try {
      const { data, error } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          *,
          candidatos(
            perfis(nome_completo, telefone, user_id)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const comps = data || [];
      setComprovativos(comps);
      
      // Calculate stats
      const newStats = {
        total: comps.length,
        pendente: comps.filter(c => c.status === "pendente").length,
        aprovado: comps.filter(c => c.status === "aprovado").length,
        rejeitado: comps.filter(c => c.status === "rejeitado").length,
        valorTotal: comps.filter(c => c.status === "aprovado").reduce((sum, c) => sum + Number(c.valor), 0),
      };
      setStats(newStats);
    } catch (error) {
      console.error("Erro ao carregar comprovativos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os comprovativos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...comprovativos];

    // Filter by status
    if (filterStatus !== "todos") {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.candidatos.perfis.nome_completo.toLowerCase().includes(term) ||
        c.candidatos.perfis.telefone?.toLowerCase().includes(term) ||
        c.tipo_servico.toLowerCase().includes(term)
      );
    }

    setFilteredComprovativos(filtered);
  };

  const aprovarPagamento = async (comprovantivoId: string, tipoServico: string, candidatoId: string) => {
    try {
      // Buscar dados do comprovativo antes de aprovar
      const { data: comprovantivoData } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          candidato_id,
          candidatos (
            perfil_id,
            perfis (
              user_id,
              nome_completo
            )
          )
        `)
        .eq("id", comprovantivoId)
        .single();

      if (!comprovantivoData) {
        toast({
          title: "Erro",
          description: "Comprovativo não encontrado",
          variant: "destructive",
        });
        return;
      }

      // Atualizar status do comprovativo
      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ 
          status: "aprovado",
          observacoes: "Pagamento aprovado pelo administrador"
        })
        .eq("id", comprovantivoId);

      if (error) throw error;

      // Lógica de liberação automática baseada no tipo de serviço
      if (tipoServico === "curso") {
        // Atualizar matrícula do curso
        const { error: enrollmentError } = await supabase
          .from("course_enrollments")
          .update({ payment_verified: true })
          .eq("comprovativo_id", comprovantivoId);

        if (enrollmentError) {
          console.error("Erro ao atualizar enrollment:", enrollmentError);
        }
      } else if (tipoServico === "conta_pro") {
        // Atualizar para conta PRO (1 ano)
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);

        await supabase
          .from("candidatos")
          .update({
            tipo_conta: "pro",
            data_expiracao_conta: expirationDate.toISOString(),
          })
          .eq("id", candidatoId);
      } else if (tipoServico === "conta_ativo" || tipoServico === "perfil_ativo") {
        // Atualizar para conta ATIVO (30 dias)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        await supabase
          .from("candidatos")
          .update({
            tipo_conta: "ativo",
            data_expiracao_conta: expirationDate.toISOString(),
          })
          .eq("id", candidatoId);
      } else if (tipoServico === "perfil_basico" || tipoServico === "criacao_perfil") {
        // Aprovar perfil básico
        const { data: candidato } = await supabase
          .from("candidatos")
          .select("perfil_id")
          .eq("id", candidatoId)
          .single();

        if (candidato) {
          await supabase
            .from("perfis")
            .update({
              status_validacao: "aprovado",
              data_validacao: new Date().toISOString(),
            })
            .eq("id", candidato.perfil_id);
        }
      }

      // Enviar notificação
      const perfil = (comprovantivoData as any).candidatos?.perfis;
      if (perfil?.user_id) {
        const tipoNotificacao = 
          tipoServico === "curso" ? "aprovacao_curso" :
          tipoServico === "conta_pro" ? "aprovacao_conta_pro" :
          tipoServico === "conta_ativo" ? "aprovacao_conta_ativo" :
          "aprovacao_perfil";

        supabase.functions.invoke("enviar-notificacao", {
          body: {
            user_id: perfil.user_id,
            nome: perfil.nome_completo,
            tipo: tipoNotificacao,
          },
        }).catch(err => console.error("Erro ao enviar notificação:", err));
      }

      toast({
        title: "Sucesso",
        description: `Pagamento aprovado! Acesso liberado automaticamente.`,
      });

      loadComprovativos();
    } catch (error) {
      console.error("Erro ao aprovar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o pagamento",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (comprovantivoId: string, tipoServico: string) => {
    setComprovantivoToReject({ id: comprovantivoId, tipo: tipoServico });
    setRejectReason("");
    setShowRejectDialog(true);
  };

  const confirmRejectPagamento = async () => {
    if (!comprovantivoToReject) return;

    try {
      const { data: comprovantivoData } = await supabase
        .from("comprovativos_pagamento")
        .select(`
          candidato_id,
          candidatos (
            perfil_id,
            perfis (
              user_id,
              nome_completo
            )
          )
        `)
        .eq("id", comprovantivoToReject.id)
        .single();

      const { error } = await supabase
        .from("comprovativos_pagamento")
        .update({ 
          status: "rejeitado",
          observacoes: rejectReason || "Comprovativo rejeitado pelo administrador"
        })
        .eq("id", comprovantivoToReject.id);

      if (error) throw error;

      // Enviar notificação
      if (comprovantivoData) {
        const perfil = (comprovantivoData as any).candidatos?.perfis;
        if (perfil?.user_id) {
          const tipoNotificacao = comprovantivoToReject.tipo === "curso" 
            ? "rejeicao_curso" 
            : "rejeicao_perfil";

          supabase.functions.invoke("enviar-notificacao", {
            body: {
              user_id: perfil.user_id,
              nome: perfil.nome_completo,
              tipo: tipoNotificacao,
              detalhes: rejectReason || "Por favor, verifique o comprovativo e envie novamente.",
            },
          }).catch(err => console.error("Erro ao enviar notificação:", err));
        }
      }

      toast({
        title: "Sucesso",
        description: "Pagamento rejeitado",
      });

      setShowRejectDialog(false);
      setComprovantivoToReject(null);
      loadComprovativos();
    } catch (error) {
      console.error("Erro ao rejeitar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o pagamento",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pendente</Badge>;
      case "aprovado":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Aprovado</Badge>;
      case "rejeitado":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoServicoBadge = (tipo: string) => {
    const labels: Record<string, string> = {
      curso: "Curso",
      conta_pro: "Conta Pro",
      conta_ativo: "Conta Ativo",
      perfil_ativo: "Perfil Ativo",
      perfil_basico: "Perfil Básico",
      criacao_perfil: "Criação Perfil",
    };
    return <Badge variant="secondary">{labels[tipo] || tipo}</Badge>;
  };

  if (loading) {
    return <div>A carregar comprovativos...</div>;
  }

  return (
    <Tabs defaultValue="gestao" className="space-y-6">
      <TabsList>
        <TabsTrigger value="gestao">Gestão de Pagamentos</TabsTrigger>
        <TabsTrigger value="teste">Criar Teste</TabsTrigger>
      </TabsList>

      <TabsContent value="gestao" className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendente}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aprovado}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Aprovado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.valorTotal.toLocaleString("pt-AO")} Kz</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Comprovativos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, telefone ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovado">Aprovados</SelectItem>
                <SelectItem value="rejeitado">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo Serviço</TableHead>
                  <TableHead>Valor (Kz)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Comprovativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComprovativos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum comprovativo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComprovativos.map((comp) => (
                    <TableRow key={comp.id}>
                      <TableCell className="font-medium">
                        {comp.candidatos.perfis.nome_completo}
                      </TableCell>
                      <TableCell>{comp.candidatos.perfis.telefone || "N/A"}</TableCell>
                      <TableCell>{getTipoServicoBadge(comp.tipo_servico)}</TableCell>
                      <TableCell>{comp.valor.toLocaleString("pt-AO")}</TableCell>
                      <TableCell>{getStatusBadge(comp.status)}</TableCell>
                      <TableCell>
                        {new Date(comp.created_at).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedComprovativo(comp)}
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Ver
                        </Button>
                      </TableCell>
                      <TableCell>
                        {comp.status === "pendente" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => aprovarPagamento(comp.id, comp.tipo_servico, comp.candidato_id)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(comp.id, comp.tipo_servico)}
                              className="gap-1"
                            >
                              <XCircle className="h-3 w-3" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        {comp.status !== "pendente" && comp.observacoes && (
                          <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {comp.observacoes}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Comprovativo Dialog */}
      <Dialog open={!!selectedComprovativo} onOpenChange={() => setSelectedComprovativo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Comprovativo</DialogTitle>
          </DialogHeader>
          {selectedComprovativo && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Cliente:</span> {selectedComprovativo.candidatos.perfis.nome_completo}
                  </div>
                  <div>
                    <span className="font-semibold">Telefone:</span> {selectedComprovativo.candidatos.perfis.telefone || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Tipo:</span> {getTipoServicoBadge(selectedComprovativo.tipo_servico)}
                  </div>
                  <div>
                    <span className="font-semibold">Valor:</span> {selectedComprovativo.valor.toLocaleString("pt-AO")} Kz
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {getStatusBadge(selectedComprovativo.status)}
                  </div>
                  <div>
                    <span className="font-semibold">Data:</span> {new Date(selectedComprovativo.created_at).toLocaleDateString("pt-PT")}
                  </div>
                </div>
                {selectedComprovativo.observacoes && (
                  <div className="mt-2">
                    <span className="font-semibold">Observações:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedComprovativo.observacoes}</p>
                  </div>
                )}
                {selectedComprovativo.dados_ocr && (
                  <div className="mt-2">
                    <span className="font-semibold">Dados OCR Extraídos:</span>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(selectedComprovativo.dados_ocr, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              <img
                src={selectedComprovativo.comprovativo_url}
                alt="Comprovativo"
                className="w-full rounded-lg border"
              />
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => window.open(selectedComprovativo.comprovativo_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir em Nova Aba
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. Esta mensagem será enviada ao cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Motivo da rejeição (ex: Comprovativo ilegível, valor incorreto, etc.)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRejectPagamento}>
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </TabsContent>

      <TabsContent value="teste">
        <AdminTestPayment />
      </TabsContent>
    </Tabs>
  );
}
