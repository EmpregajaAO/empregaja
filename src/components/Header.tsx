import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
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
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/cadastro">Criar Perfil</Link>
          </Button>
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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container flex flex-col gap-4 py-4">
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
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="ghost" asChild onClick={() => setIsMenuOpen(false)}>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" asChild onClick={() => setIsMenuOpen(false)}>
                <Link to="/cadastro">Criar Perfil</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
