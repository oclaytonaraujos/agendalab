
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return { title: "Dashboard", description: "Bem-vindo ao sistema de agendamento" };
      case '/agendamentos':
        return { title: "Agendamentos", description: "Gerencie os agendamentos do laboratório" };
      case '/materiais':
        return { title: "Materiais", description: "Controle de estoque e materiais do laboratório" };
      case '/professores':
        return { title: "Professores", description: "Gestão de professores e usuários" };
      case '/relatorios':
        return { title: "Relatórios", description: "Relatórios e estatísticas do sistema" };
      case '/perfil':
        return { title: "Perfil", description: "Gerencie suas informações pessoais" };
      case '/configuracoes':
        return { title: "Configurações", description: "Ajuste as configurações do sistema" };
      default:
        return { title: "Dashboard", description: "Bem-vindo ao sistema de agendamento" };
    }
  };

  const { title, description } = getPageInfo(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-green-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header title={title} description={description} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
