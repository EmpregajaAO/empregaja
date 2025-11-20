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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-sm text-muted-foreground mt-1">EmpregaJá - Gestão Completa</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 lg:w-auto">
          <TabsTrigger value="dashboard" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="comprovativos" className="gap-2">
            <FileText className="h-4 w-4" />
            Comprovativos
          </TabsTrigger>
          <TabsTrigger value="perfis" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Perfis
          </TabsTrigger>
          <TabsTrigger value="vagas" className="gap-2">
            <MapPin className="h-4 w-4" />
            Vagas
          </TabsTrigger>
          <TabsTrigger value="gestao-cursos" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Gestão Cursos
          </TabsTrigger>
          <TabsTrigger value="cursos" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Pag. Cursos
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="salarios" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Salários
          </TabsTrigger>
          <TabsTrigger value="promocoes" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Promoções
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

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