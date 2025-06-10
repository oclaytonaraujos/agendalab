
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AgendamentoForm {
  data: Date;
  horario: string;
  disciplina: string;
  turma: string;
  observacoes?: string;
}

const horarios = [
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

interface NovoAgendamentoModalProps {
  onAgendamentoCreated?: () => void;
}

export const NovoAgendamentoModal = ({ onAgendamentoCreated }: NovoAgendamentoModalProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AgendamentoForm>();
  const { toast } = useToast();
  const { user } = useAuth();

  const onSubmit = async (data: AgendamentoForm) => {
    if (!date) {
      toast({
        title: "Erro",
        description: "Selecione uma data para o agendamento.",
        variant: "destructive",
      });
      return;
    }

    // Simular criação do agendamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Novo agendamento:', { ...data, data: date, professor: user?.name });
    
    toast({
      title: "Agendamento criado!",
      description: `Laboratório reservado para ${format(date, "dd/MM/yyyy", { locale: ptBR })} às ${data.horario}`,
    });

    setOpen(false);
    reset();
    setDate(undefined);
    onAgendamentoCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Reserve o laboratório para sua aula. Preencha os dados abaixo.
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
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario">Horário</Label>
            <Select onValueChange={(value) => setValue('horario', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {horarios.map((horario) => (
                  <SelectItem key={horario} value={horario}>
                    {horario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
