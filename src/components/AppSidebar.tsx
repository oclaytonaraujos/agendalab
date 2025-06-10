
import { Calendar, FlaskConical, BarChart3, Users, Settings, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    roles: ['admin', 'coordenacao'], // Apenas admin e coordenacao
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: Calendar,
    roles: ['admin', 'coordenacao', 'professor'],
  },
  {
    title: "Materiais",
    url: "/materiais",
    icon: FlaskConical,
    roles: ['admin', 'coordenacao', 'professor'],
  },
  {
    title: "Professores",
    url: "/professores",
    icon: Users,
    roles: ['admin', 'coordenacao'], // Apenas admin e coordenacao
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BookOpen,
    roles: ['admin', 'coordenacao'], // Apenas admin e coordenacao
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <Sidebar className="border-r border-blue-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agenda Lab</h2>
            <p className="text-sm text-gray-600">Sistema de Laboratório</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
