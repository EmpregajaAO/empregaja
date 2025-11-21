import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Call the edge function to validate admin status securely
      const { data, error } = await supabase.functions.invoke('validate-admin');

      if (error) {
        console.error("Error validating admin:", error);
        toast({
          title: "Erro de Autenticação",
          description: "Falha ao validar permissões de administrador.",
          variant: "destructive",
        });
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(data?.isAdmin === true);
    } catch (error) {
      console.error("Erro ao verificar acesso admin:", error);
      toast({
        title: "Erro de Autenticação",
        description: "Falha ao conectar ao servidor de autenticação.",
        variant: "destructive",
      });
      setIsAdmin(false);
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
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
