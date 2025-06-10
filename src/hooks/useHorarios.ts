
import { useState, useEffect } from 'react';

export interface HorarioSlot {
  horario: string;
  disponivel: boolean;
  agendadoPor?: string;
}

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

export const useHorarios = (selectedDate?: Date, agendamentos?: Agendamento[]) => {
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioSlot[]>([]);

  const todosHorarios = [
    "06:30 - 08:10",
    "08:00 - 09:40",
    "10:00 - 11:40",
    "13:00 - 14:40",
    "14:00 - 15:40",
    "16:00 - 17:40",
  ];

  useEffect(() => {
    if (!selectedDate) {
      setHorariosDisponiveis([]);
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    
    // Filtrar agendamentos para a data selecionada que não estão cancelados
    const agendamentosData = agendamentos ? agendamentos.filter(
      ag => ag.data === dateString && ag.status !== 'cancelado'
    ) : [];

    const slots: HorarioSlot[] = todosHorarios.map(horario => {
      const ocupado = agendamentosData.find(ag => ag.horario === horario);
      return {
        horario,
        disponivel: !ocupado,
        agendadoPor: ocupado?.professor
      };
    });

    setHorariosDisponiveis(slots);
  }, [selectedDate, agendamentos]);

  return {
    horariosDisponiveis,
    horariosLivres: horariosDisponiveis.filter(h => h.disponivel)
  };
};
