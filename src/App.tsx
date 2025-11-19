import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatAssistant } from "@/components/ChatAssistant";
import Index from "./pages/Index";
import Candidatos from "./pages/Candidatos";
import Empregadores from "./pages/Empregadores";
import Cursos from "./pages/Cursos";
import Vagas from "./pages/Vagas";
import VagasAgregadas from "./pages/VagasAgregadas";
import PerfilCandidato from "./pages/PerfilCandidato";
import PerfilEmpregador from "./pages/PerfilEmpregador";
import SalaDeAula from "./pages/SalaDeAula";
import Privacidade from "./pages/Privacidade";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import Admin from "./pages/Admin";
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
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/vagas-agregadas" element={<VagasAgregadas />} />
          <Route path="/perfil-candidato" element={<PerfilCandidato />} />
          <Route path="/perfil-empregador" element={<PerfilEmpregador />} />
          <Route path="/sala-de-aula/:courseId" element={<SalaDeAula />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/confirmacao-pagamento" element={<PaymentConfirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
