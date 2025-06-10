
import { useState } from "react";
import { Calendar, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NovoAgendamentoModal } from "@/components/Agendamentos/NovoAgendamentoModal";
import { EditarAgendamentoModal } from "@/components/Agendamentos/EditarAgendamentoModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Agendamento {
  id: number;
  data: string;
  horario: string;
  professor: string;
  disciplina: string;
  turma: string;
  status: string;
  observacoes?: string;
}

const Agendamentos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      data: "2024-06-10",
      horario: "08:00 - 09:40",
      professor: "Prof. Maria Silva",
      disciplina: "Química",
      turma: "3º A",
      status: "confirmado",
    },
    {
      id: 2,
      data: "2024-06-10",
      horario: "10:00 - 11:40",
      professor: "Prof. João Santos",
      disciplina: "Física",
      turma: "2º B",
      status: "pendente",
    },
    {
      id: 3,
      data: "2024-06-10",
      horario: "14:00 - 15:40",
      professor: "Prof. Ana Costa",
      disciplina: "Biologia",
      turma: "1º C",
      status: "confirmado",
    },
  ]);

  const [agendamentoParaEditar, setAgendamentoParaEditar] = useState<Agendamento | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  // Calcular horários disponíveis baseado nos agendamentos não cancelados
  const getHorariosDisponiveis = () => {
    const todosHorarios = [
      "06:30 - 08:10",
      "08:00 - 09:40",
      "10:00 - 11:40",
      "13:00 - 14:40",
      "14:00 - 15:40",
      "16:00 - 17:40",
    ];

    const today = new Date().toISOString().split('T')[0];
    const agendamentosHoje = agendamentos.filter(
      ag => ag.data === today && ag.status !== 'cancelado'
    );

    return todosHorarios.map(horario => {
      const ocupado = agendamentosHoje.find(ag => ag.horario === horario);
      return {
        horario,
        disponivel: !ocupado,
        agendadoPor: ocupado?.professor
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canManageAgendamentos = user?.role === 'admin' || user?.role === 'coordenacao';
  const canCreateAgendamento = true;

  const handleEditarAgendamento = (agendamento: Agendamento) => {
    setAgendamentoParaEditar(agendamento);
    setModalEditarAberto(true);
  };

  const createNotificationForAdmins = (message: string, agendamento: Agendamento) => {
    // Simular criação de notificação para admin/coordenação
    console.log(`Notificação criada para admin/coordenação: ${message}`, agendamento);
    
    if (user?.role === 'professor') {
      toast({
        title: "Notificação enviada",
        description: "A coordenação foi notificada sobre esta alteração.",
      });
    }
  };

  const handleCancelarAgendamento = async (agendamento: Agendamento) => {
    const isProfessor = user?.role === 'professor';
    const isOwnAgendamento = isProfessor && agendamento.professor.includes(user.name);
    
    if (!canManageAgendamentos && !isOwnAgendamento) return;

    const confirmMessage = isProfessor 
      ? `Tem certeza que deseja cancelar seu agendamento para ${agendamento.disciplina}?`
      : `Tem certeza que deseja cancelar o agendamento de ${agendamento.professor}?`;

    if (window.confirm(confirmMessage)) {
      // Simular cancelamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAgendamentos(prev => 
        prev.map(ag => 
          ag.id === agendamento.id 
            ? { ...ag, status: 'cancelado' }
            : ag
        )
      );

      // Se for professor cancelando próprio agendamento, notificar admin/coordenação
      if (isProfessor && isOwnAgendamento) {
        createNotificationForAdmins(
          `Professor ${user.name} cancelou agendamento de ${agendamento.disciplina} para ${new Date(agendamento.data).toLocaleDateString()} às ${agendamento.horario}`,
          agendamento
        );
      }

      toast({
        title: "Agendamento cancelado",
        description: `O agendamento ${isProfessor ? 'foi' : `de ${agendamento.professor} foi`} cancelado com sucesso.`,
      });
    }
  };

  const onAgendamentoCreated = () => {
    console.log("Novo agendamento criado - atualizando lista");
  };

  const onAgendamentoUpdated = (updatedAgendamento?: Agendamento) => {
    if (updatedAgendamento && user?.role === 'professor') {
      createNotificationForAdmins(
        `Professor ${user.name} editou agendamento de ${updatedAgendamento.disciplina} para ${new Date(updatedAgendamento.data).toLocaleDateString()} às ${updatedAgendamento.horario}`,
        updatedAgendamento
      );
    }
    console.log("Agendamento atualizado - atualizando lista");
  };

  const canEditAgendamento = (agendamento: Agendamento) => {
    if (canManageAgendamentos) return true;
    if (user?.role === 'professor' && agendamento.professor.includes(user.name)) return true;
    return false;
  };

  const canCancelAgendamento = (agendamento: Agendamento) => {
    if (canManageAgendamentos) return true;
    if (user?.role === 'professor' && agendamento.professor.includes(user.name)) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {canCreateAgendamento && <NovoAgendamentoModal onAgendamentoCreated={onAgendamentoCreated} />}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar por professor, disciplina ou turma..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Lista de Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentos.map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {agendamento.professor}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              agendamento.status
                            )}`}
                          >
                            {agendamento.status}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          <strong>{agendamento.disciplina}</strong> - {agendamento.turma}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(agendamento.data).toLocaleDateString()} • {agendamento.horario}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {canEditAgendamento(agendamento) && agendamento.status !== 'cancelado' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditarAgendamento(agendamento)}
                          >
                            Editar
                          </Button>
                        )}
                        {canCancelAgendamento(agendamento) && agendamento.status !== 'cancelado' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleCancelarAgendamento(agendamento)}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horários Disponíveis Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getHorariosDisponiveis().map((slot, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      slot.disponivel
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{slot.horario}</span>
                      <span className="text-sm">
                        {slot.disponivel ? "Disponível" : "Ocupado"}
                      </span>
                    </div>
                    {!slot.disponivel && slot.agendadoPor && (
                      <div className="text-xs mt-1 opacity-75">
                        {slot.agendadoPor}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {canManageAgendamentos && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agendamentos hoje:</span>
                    <span className="font-semibold">{agendamentos.filter(ag => ag.data === new Date().toISOString().split('T')[0] && ag.status !== 'cancelado').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de ocupação:</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((agendamentos.filter(ag => ag.data === new Date().toISOString().split('T')[0] && ag.status !== 'cancelado').length / 6) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Professor mais ativo:</span>
                    <span className="font-semibold">Prof. Maria Silva</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <EditarAgendamentoModal
        agendamento={agendamentoParaEditar}
        open={modalEditarAberto}
        onOpenChange={setModalEditarAberto}
        onAgendamentoUpdated={onAgendamentoUpdated}
      />
    </div>
  );
};

export default Agendamentos;
