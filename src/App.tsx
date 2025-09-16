import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TreasuryDashboard from "./pages/TreasuryDashboard";
import Login from "./pages/Login"; // Importar a página de Login
import { SessionContextProvider } from "./components/SessionContextProvider"; // Importar o provedor de sessão
import { Navbar } from "./components/layout/Navbar"; // Importar a barra de navegação

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider> {/* Envolver toda a aplicação com o provedor de sessão */}
          <Navbar /> {/* Adicionar a barra de navegação */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} /> {/* Rota para a página de login */}
            <Route path="/treasury" element={<TreasuryDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;