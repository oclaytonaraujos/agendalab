
import { Users, Mail, Shield, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Professores = () => {
  const professores = [
    {
      id: 1,
      nome: "Prof. João Silva",
      email: "joao.silva@escola.com",
      role: "professor",
      departamento: "Química",
      telefone: "(11) 99999-0001",
      status: "ativo",
      ultimoAcesso: "Hoje às 14:30"
    },
    {
      id: 2,
      nome: "Dra. Maria Santos",
      email: "maria.santos@escola.com",
      role: "coordenacao",
      departamento: "Biologia",
      telefone: "(11) 99999-0002",
      status: "ativo",
      ultimoAcesso: "Ontem às 16:45"
    },
    {
      id: 3,
      nome: "Prof. Carlos Oliveira",
      email: "carlos.oliveira@escola.com",
      role: "professor",
      departamento: "Física",
      telefone: "(11) 99999-0003",
      status: "inativo",
      ultimoAcesso: "3 dias atrás"
    },
    {
      id: 4,
      nome: "Admin Sistema",
      email: "admin@escola.com",
      role: "admin",
      departamento: "Administração",
      telefone: "(11) 99999-0000",
      status: "ativo",
      ultimoAcesso: "Hoje às 09:15"
    },
  ];

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'coordenacao': return 'Coordenação';
      case 'professor': return 'Professor';
      default: return role;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'coordenacao':
        return <Badge className="bg-blue-100 text-blue-800">Coordenação</Badge>;
      case 'professor':
        return <Badge className="bg-green-100 text-green-800">Professor</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-orange-100 text-orange-800">Inativo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Professor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professores.length}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {professores.filter(p => p.role === 'professor').length}
            </div>
            <p className="text-xs text-muted-foreground">professores ativos</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coordenação</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {professores.filter(p => p.role === 'coordenacao').length}
            </div>
            <p className="text-xs text-muted-foreground">coordenadores</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {professores.filter(p => p.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">administradores</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar por nome, email ou departamento..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filtrar por Função
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Lista de Professores e Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professores.map((professor) => (
                <TableRow key={professor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {getInitials(professor.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{professor.nome}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {professor.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(professor.role)}
                  </TableCell>
                  <TableCell>{professor.departamento}</TableCell>
                  <TableCell>
                    {getStatusBadge(professor.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {professor.ultimoAcesso}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Professores;
