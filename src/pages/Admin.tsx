import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Users, 
  UserCheck, 
  Bell, 
  Briefcase,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminPerfis } from "@/components/admin/AdminPerfis";
import { AdminFuncionarios } from "@/components/admin/AdminFuncionarios";
import { AdminSalarios } from "@/components/admin/AdminSalarios";
import { AdminNotificacoes } from "@/components/admin/AdminNotificacoes";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (error || !roles) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Erro ao verificar acesso admin:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Painel de Administração</h1>
        <p className="text-muted-foreground">Gerencie toda a plataforma EmpregaJá</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="dashboard" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="perfis" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Perfis
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="salarios" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Salários
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="perfis">
          <AdminPerfis />
        </TabsContent>

        <TabsContent value="funcionarios">
          <AdminFuncionarios />
        </TabsContent>

        <TabsContent value="salarios">
          <AdminSalarios />
        </TabsContent>

        <TabsContent value="notificacoes">
          <AdminNotificacoes />
        </TabsContent>
      </Tabs>
    </div>
  );
}