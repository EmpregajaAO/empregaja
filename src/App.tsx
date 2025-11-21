import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatAssistant } from "@/components/ChatAssistant";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";
import Index from "./pages/Index";
import Candidatos from "./pages/Candidatos";
import Empregadores from "./pages/Empregadores";
import Cursos from "./pages/Cursos";
import VagasAgregadas from "./pages/VagasAgregadas";
import VagaDetalhes from "./pages/VagaDetalhes";
import PerfilCandidato from "./pages/PerfilCandidato";
import PerfilEmpregador from "./pages/PerfilEmpregador";
import SalaDeAula from "./pages/SalaDeAula";
import Privacidade from "./pages/Privacidade";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import Auth from "./pages/Auth";
import Instalar from "./pages/Instalar";
import PaymentConfirmation from "./components/PaymentConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/empregadores" element={<Empregadores />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/vagas" element={<VagasAgregadas />} />
          <Route path="/vaga/:id" element={<VagaDetalhes />} />
          <Route path="/perfil-candidato" element={<PerfilCandidato />} />
          <Route path="/perfil-empregador" element={<PerfilEmpregador />} />
          <Route path="/sala-de-aula/:courseId" element={<SalaDeAula />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/instalar" element={<Instalar />} />
          <Route path="/confirmacao-pagamento" element={<PaymentConfirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MobileBottomNav />
        <InstallPrompt />
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
