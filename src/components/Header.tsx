
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  title?: string;
  description?: string;
}

export const Header = ({ title = "Dashboard", description = "Bem-vindo ao sistema de agendamento" }: HeaderProps) => {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'coordenacao': return 'Coordenação';
      case 'professor': return 'Professor';
      default: return role;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-blue-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-600 hover:text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <span className="text-sm font-medium">{user?.name}</span>
                <p className="text-xs text-gray-500">{user ? getRoleDisplay(user.role) : ''}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={logout}
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
