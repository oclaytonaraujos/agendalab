import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import Materiais from "./pages/Materiais";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Professores from "./pages/Professores";
import Relatorios from "./pages/Relatorios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Agendamentos />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/materiais" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Materiais />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/professores" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'coordenacao']}>
                  <Layout>
                    <Professores />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'coordenacao']}>
                  <Layout>
                    <Relatorios />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
