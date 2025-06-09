
import { Calendar, FlaskConical, Users, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { QuickActions } from "@/components/Dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Agendamentos Hoje"
          value="8"
          icon={Calendar}
          description="3 pendentes"
          trend="up"
          trendValue="+2"
        />
        <StatsCard
          title="Materiais Disponíveis"
          value="156"
          icon={FlaskConical}
          description="em estoque"
          trend="neutral"
        />
        <StatsCard
          title="Professores Ativos"
          value="24"
          icon={Users}
          description="este mês"
          trend="up"
          trendValue="+3"
        />
        <StatsCard
          title="Alertas de Estoque"
          value="5"
          icon={AlertTriangle}
          description="materiais baixos"
          trend="down"
          trendValue="-2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Agendamentos</h3>
          <div className="space-y-3">
            {[
              { time: "08:00", professor: "Prof. Maria Silva", disciplina: "Química", turma: "3º A" },
              { time: "10:00", professor: "Prof. João Santos", disciplina: "Física", turma: "2º B" },
              { time: "14:00", professor: "Prof. Ana Costa", disciplina: "Biologia", turma: "1º C" },
            ].map((agendamento, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {agendamento.time}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agendamento.professor}</p>
                    <p className="text-sm text-gray-600">{agendamento.disciplina} - {agendamento.turma}</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Materiais com Estoque Baixo</h3>
          <div className="space-y-3">
            {[
              { nome: "Tubos de Ensaio", estoque: 5, minimo: 20 },
              { nome: "Lâminas de Microscópio", estoque: 8, minimo: 25 },
              { nome: "Béqueres 250ml", estoque: 3, minimo: 15 },
            ].map((material, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{material.nome}</p>
                  <p className="text-sm text-gray-600">
                    Estoque: {material.estoque} | Mínimo: {material.minimo}
                  </p>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
