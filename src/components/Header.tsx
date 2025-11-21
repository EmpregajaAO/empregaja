import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import angolaFlag from "@/assets/angola-flag.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user type
        if (session?.user) {
          setTimeout(() => {
            fetchUserType(session.user.id);
          }, 0);
        } else {
          setUserType(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserType(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserType = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("perfis")
        .select("tipo_utilizador")
        .eq("user_id", userId)
        .maybeSingle();
      
      setUserType(data?.tipo_utilizador || null);
    } catch (error) {
      console.error("Erro ao buscar tipo de usuário:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserType(null);
      toast({
        title: "Até breve!",
        description: "Logout realizado com sucesso",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const getUserProfileLink = () => {
    if (userType === "candidato") return "/perfil-candidato";
    if (userType === "empregador") return "/perfil-empregador";
    return "/cadastro";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src={angolaFlag} alt="Bandeira de Angola" className="h-8 w-8 rounded object-cover" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EmpregaJá
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/candidatos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Candidatos
          </Link>
          <Link to="/empregadores" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Empregadores
          </Link>
          <Link to="/cursos" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Cursos
          </Link>
          <Link to="/vagas" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Vagas
          </Link>
          <Link to="/sobre" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Sobre
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100] bg-background border shadow-lg">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getUserProfileLink())}>
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/cadastro">Criar Perfil</Link>
              </Button>
            </>
          )}
          <div className="h-6 w-px bg-border mx-2" />
          <Link to="/admin/login">
            <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10">
              <User className="h-4 w-4" />
              Admin Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur overflow-hidden">
          <nav className="container flex flex-col gap-3 py-4 px-4">
            <Link
              to="/candidatos"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Candidatos
            </Link>
            <Link
              to="/empregadores"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Empregadores
            </Link>
            <Link
              to="/cursos"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos
            </Link>
            <Link
              to="/vagas"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Vagas
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <div className="pt-2 border-t border-border">
              <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full gap-2 border-primary/20 hover:bg-primary/10">
                  <User className="h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {user ? (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to={getUserProfileLink()}>
                      <User className="h-4 w-4 mr-2" />
                      Meu Perfil
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/auth">Entrar</Link>
                  </Button>
                  <Button variant="hero" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/cadastro">Criar Perfil</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
