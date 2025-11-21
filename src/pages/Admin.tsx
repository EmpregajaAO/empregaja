import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, 
  Users, 
  UserCheck, 
  Bell, 
  Briefcase,
  TrendingUp,
  Calendar,
  AlertCircle,
  BookOpen,
  Megaphone,
  MapPin,
  FileText
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminPerfis } from "@/components/admin/AdminPerfis";
import { AdminFuncionarios } from "@/components/admin/AdminFuncionarios";
import { AdminSalarios } from "@/components/admin/AdminSalarios";
import { AdminNotificacoes } from "@/components/admin/AdminNotificacoes";
import { AdminVagas } from "@/components/admin/AdminVagas";
import { AdminCursos } from "@/components/admin/AdminCursos";
import { AdminPromocoes } from "@/components/admin/AdminPromocoes";
import { AdminComprovativos } from "@/components/admin/AdminComprovativos";
import { AdminGestãoCursos } from "@/components/admin/AdminGestãoCursos";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Até breve!",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">EmpregaJá - Gestão Completa</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 w-full sm:w-auto">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-6 md:py-8 px-4">

      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-5 lg:grid-cols-10 gap-1">
            <TabsTrigger value="dashboard" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger value="comprovativos" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Comprovativos</span>
              <span className="sm:hidden">Comprov.</span>
            </TabsTrigger>
            <TabsTrigger value="perfis" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              Perfis
            </TabsTrigger>
            <TabsTrigger value="vagas" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
              Vagas
            </TabsTrigger>
            <TabsTrigger value="gestao-cursos" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Gestão Cursos</span>
              <span className="sm:hidden">Gestão</span>
            </TabsTrigger>
            <TabsTrigger value="cursos" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pag. Cursos</span>
              <span className="sm:hidden">Cursos</span>
            </TabsTrigger>
            <TabsTrigger value="funcionarios" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Funcionários</span>
              <span className="sm:hidden">Func.</span>
            </TabsTrigger>
            <TabsTrigger value="salarios" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Salários</span>
              <span className="sm:hidden">Sal.</span>
            </TabsTrigger>
            <TabsTrigger value="promocoes" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Promoções</span>
              <span className="sm:hidden">Promo</span>
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Notificações</span>
              <span className="sm:hidden">Notif.</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="comprovativos">
          <AdminComprovativos />
        </TabsContent>

        <TabsContent value="perfis">
          <AdminPerfis />
        </TabsContent>

        <TabsContent value="vagas">
          <AdminVagas />
        </TabsContent>

        <TabsContent value="gestao-cursos">
          <AdminGestãoCursos />
        </TabsContent>

        <TabsContent value="cursos">
          <AdminCursos />
        </TabsContent>

        <TabsContent value="funcionarios">
          <AdminFuncionarios />
        </TabsContent>

        <TabsContent value="salarios">
          <AdminSalarios />
        </TabsContent>

        <TabsContent value="promocoes">
          <AdminPromocoes />
        </TabsContent>

        <TabsContent value="notificacoes">
          <AdminNotificacoes />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}