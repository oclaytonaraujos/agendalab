
import { useState, useEffect } from 'react';

export interface HorarioSlot {
  horario: string;
  disponivel: boolean;
  agendadoPor?: string;
}

export const useHorarios = (selectedDate?: Date) => {
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioSlot[]>([]);

  const todosHorarios = [
    '07:00 - 07:50',
    '07:50 - 08:40',
    '08:40 - 09:30',
    '09:50 - 10:40',
    '10:40 - 11:30',
    '11:30 - 12:20',
    '13:00 - 13:50',
    '13:50 - 14:40',
    '14:40 - 15:30',
    '15:50 - 16:40',
    '16:40 - 17:30',
  ];

  useEffect(() => {
    if (!selectedDate) {
      setHorariosDisponiveis([]);
      return;
    }

    // Simular horários ocupados baseado na data
    const horariosOcupados = [
      { horario: '08:40 - 09:30', agendadoPor: 'Prof. Maria Silva' },
      { horario: '10:40 - 11:30', agendadoPor: 'Prof. João Santos' },
      { horario: '14:40 - 15:30', agendadoPor: 'Prof. Ana Costa' },
    ];

    const slots: HorarioSlot[] = todosHorarios.map(horario => {
      const ocupado = horariosOcupados.find(h => h.horario === horario);
      return {
        horario,
        disponivel: !ocupado,
        agendadoPor: ocupado?.agendadoPor
      };
    });

    setHorariosDisponiveis(slots);
  }, [selectedDate]);

  return {
    horariosDisponiveis,
    horariosLivres: horariosDisponiveis.filter(h => h.disponivel)
  };
};
