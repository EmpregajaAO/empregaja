import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle, Building2 } from "lucide-react";

const WelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleChoice = (type: "candidato" | "empregador") => {
    localStorage.setItem("hasSeenWelcome", "true");
    setOpen(false);
    if (type === "candidato") {
      navigate("/cadastro");
    } else {
      navigate("/empregadores");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Bem-vindo ao EmpregaJá!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Para começar, por favor selecione o seu perfil:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-all"
            onClick={() => handleChoice("candidato")}
          >
            <UserCircle className="h-8 w-8 text-primary" />
            <div className="text-center">
              <div className="font-semibold">Sou Candidato</div>
              <div className="text-xs text-muted-foreground">Procuro emprego</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-accent/10 hover:border-accent transition-all"
            onClick={() => handleChoice("empregador")}
          >
            <Building2 className="h-8 w-8 text-accent" />
            <div className="text-center">
              <div className="font-semibold">Sou Empregador</div>
              <div className="text-xs text-muted-foreground">Procuro candidatos</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
