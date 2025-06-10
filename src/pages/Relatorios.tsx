
import { BarChart3, Calendar, Download, TrendingUp, Users, FlaskConical, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Relatorios = () => {
  const agendamentosData = [
    { mes: 'Jan', agendamentos: 45, concluidos: 42 },
    { mes: 'Fev', agendamentos: 52, concluidos: 48 },
    { mes: 'Mar', agendamentos: 38, concluidos: 35 },
    { mes: 'Abr', agendamentos: 67, concluidos: 62 },
    { mes: 'Mai', agendamentos: 71, concluidos: 68 },
    { mes: 'Jun', agendamentos: 58, concluidos: 55 },
  ];

  const materiaisData = [
    { categoria: 'Vidraria', quantidade: 156, valor: 30 },
    { categoria: 'Químicos', quantidade: 89, valor: 25 },
    { categoria: 'Equipamentos', quantidade: 34, valor: 20 },
    { categoria: 'Consumíveis', quantidade: 234, valor: 15 },
    { categoria: 'Instrumentos', quantidade: 67, valor: 10 },
  ];

  const usageData = [
    { nome: 'Laboratório A', utilizacao: 85 },
    { nome: 'Laboratório B', utilizacao: 72 },
    { nome: 'Laboratório C', utilizacao: 91 },
    { nome: 'Laboratório D', utilizacao: 64 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const relatoriosDisponiveis = [
    {
      nome: "Agendamentos Mensais",
      descricao: "Relatório detalhado dos agendamentos realizados no mês",
      formato: "PDF"
    },
    {
      nome: "Utilização de Materiais",
      descricao: "Consumo e movimentação de materiais por período",
      formato: "Excel"
    },
    {
      nome: "Relatório de Professores",
      descricao: "Lista completa de professores e suas atividades",
      formato: "PDF"
    },
    {
      nome: "Estatísticas Gerais",
      descricao: "Resumo executivo com principais indicadores",
      formato: "PDF"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4">
          <Select defaultValue="30dias">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Totais</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">331</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Utilização</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">78%</div>
            <p className="text-xs text-muted-foreground">dos laboratórios</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais Utilizados</CardTitle>
            <FlaskConical className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">580</div>
            <p className="text-xs text-muted-foreground">itens movimentados</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">24</div>
            <p className="text-xs text-muted-foreground">utilizaram os laboratórios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Agendamentos por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agendamentosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="agendamentos" fill="#3B82F6" name="Agendados" />
                <Bar dataKey="concluidos" fill="#10B981" name="Concluídos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Utilização dos Laboratórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="utilizacao" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Utilização (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-purple-600" />
              Distribuição de Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materiaisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, valor }) => `${categoria}: ${valor}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {materiaisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Relatórios Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosDisponiveis.map((relatorio, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{relatorio.nome}</h4>
                    <p className="text-sm text-gray-600">{relatorio.descricao}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{relatorio.formato}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Relatorios;
