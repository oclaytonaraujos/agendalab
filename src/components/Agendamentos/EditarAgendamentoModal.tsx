
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useHorarios } from '@/hooks/useHorarios';

interface AgendamentoForm {
  data: Date;
  horario: string;
  disciplina: string;
  turma: string;
  observacoes?: string;
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

interface EditarAgendamentoModalProps {
  agendamento: Agendamento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgendamentoUpdated?: (agendamento?: Agendamento) => void;
}

export const EditarAgendamentoModal = ({ 
  agendamento, 
  open, 
  onOpenChange, 
  onAgendamentoUpdated 
}: EditarAgendamentoModalProps) => {
  const [date, setDate] = useState<Date>();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AgendamentoForm>();
  const { toast } = useToast();
  const { horariosLivres } = useHorarios(date);

  useEffect(() => {
    if (agendamento && open) {
      const agendamentoDate = new Date(agendamento.data);
      setDate(agendamentoDate);
      setValue('disciplina', agendamento.disciplina);
      setValue('turma', agendamento.turma);
      setValue('horario', agendamento.horario);
      setValue('observacoes', agendamento.observacoes || '');
    }
  }, [agendamento, open, setValue]);

  const onSubmit = async (data: AgendamentoForm) => {
    if (!date || !agendamento) {
      toast({
        title: "Erro",
        description: "Dados incompletos para atualizar o agendamento.",
        variant: "destructive",
      });
      return;
    }

    // Simular atualização do agendamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedAgendamento: Agendamento = {
      ...agendamento,
      data: date.toISOString().split('T')[0],
      horario: data.horario,
      disciplina: data.disciplina,
      turma: data.turma,
      observacoes: data.observacoes
    };
    
    console.log('Agendamento atualizado:', updatedAgendamento);
    
    toast({
      title: "Agendamento atualizado!",
      description: `Alterações salvas para ${format(date, "dd/MM/yyyy", { locale: ptBR })} às ${data.horario}`,
    });

    onOpenChange(false);
    reset();
    setDate(undefined);
    onAgendamentoUpdated?.(updatedAgendamento);
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
    setDate(undefined);
  };

  if (!agendamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription>
            Modifique os dados do agendamento de {agendamento.professor}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario">Horário</Label>
            {!date ? (
              <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Selecione uma data primeiro</span>
                </div>
              </div>
            ) : (
              <Select onValueChange={(value) => setValue('horario', value)} defaultValue={agendamento.horario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {/* Incluir o horário atual mesmo se não estiver disponível */}
                  {!horariosLivres.find(h => h.horario === agendamento.horario) && (
                    <SelectItem value={agendamento.horario}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {agendamento.horario} (atual)
                      </div>
                    </SelectItem>
                  )}
                  {horariosLivres.map((slot) => (
                    <SelectItem key={slot.horario} value={slot.horario}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        {slot.horario}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Input
              id="disciplina"
              placeholder="Ex: Química, Física, Biologia"
              {...register('disciplina', { required: true })}
            />
            {errors.disciplina && <p className="text-sm text-red-500">Disciplina é obrigatória</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <Input
              id="turma"
              placeholder="Ex: 3º A, 2º B"
              {...register('turma', { required: true })}
            />
            {errors.turma && <p className="text-sm text-red-500">Turma é obrigatória</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Input
              id="observacoes"
              placeholder="Informações adicionais sobre a aula"
              {...register('observacoes')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
