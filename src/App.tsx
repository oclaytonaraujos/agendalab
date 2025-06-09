
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import Materiais from "./pages/Materiais";
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
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/agendamentos" element={<Layout><Agendamentos /></Layout>} />
          <Route path="/materiais" element={<Layout><Materiais /></Layout>} />
          <Route path="/professores" element={<Layout><div className="p-6"><h1 className="text-3xl font-bold">Professores</h1><p className="text-gray-600 mt-2">Seção em desenvolvimento...</p></div></Layout>} />
          <Route path="/relatorios" element={<Layout><div className="p-6"><h1 className="text-3xl font-bold">Relatórios</h1><p className="text-gray-600 mt-2">Seção em desenvolvimento...</p></div></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
