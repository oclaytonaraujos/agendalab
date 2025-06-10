
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
import { CalendarIcon, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useHorarios } from '@/hooks/useHorarios';

interface AgendamentoForm {
  data: Date;
  horario: string;
  disciplina: string;
  turma: string;
  observacoes?: string;
}

interface NovoAgendamentoModalProps {
  onAgendamentoCreated?: () => void;
}

export const NovoAgendamentoModal = ({ onAgendamentoCreated }: NovoAgendamentoModalProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AgendamentoForm>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { horariosLivres } = useHorarios(date);

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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario">Horário Disponível</Label>
            {!date ? (
              <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Selecione uma data primeiro</span>
                </div>
              </div>
            ) : horariosLivres.length === 0 ? (
              <div className="p-3 border border-red-200 rounded-md bg-red-50">
                <div className="flex items-center gap-2 text-red-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Nenhum horário disponível nesta data</span>
                </div>
              </div>
            ) : (
              <Select onValueChange={(value) => setValue('horario', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário disponível" />
                </SelectTrigger>
                <SelectContent>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!date || horariosLivres.length === 0}
            >
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
