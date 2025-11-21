import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileBottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/vagas", icon: Briefcase, label: "Vagas" },
    { path: "/cursos", icon: GraduationCap, label: "Cursos" },
    { path: "/perfil-candidato", icon: User, label: "Perfil" },
  ];

  // Don't show on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "fill-current"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
