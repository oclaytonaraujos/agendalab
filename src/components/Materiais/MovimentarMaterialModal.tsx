
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MovimentacaoForm {
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  observacoes?: string;
}

interface Material {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  minimo: number;
  localizacao: string;
  status: string;
}

interface MovimentarMaterialModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMovimentacaoCreated?: () => void;
}

export const MovimentarMaterialModal = ({ 
  material, 
  open, 
  onOpenChange, 
  onMovimentacaoCreated 
}: MovimentarMaterialModalProps) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MovimentacaoForm>();
  const { toast } = useToast();
  const tipoMovimentacao = watch('tipo');

  const onSubmit = async (data: MovimentacaoForm) => {
    if (!material) return;

    // Validar se há estoque suficiente para saída
    if (data.tipo === 'saida' && data.quantidade > material.estoque) {
      toast({
        title: "Erro",
        description: "Quantidade insuficiente em estoque.",
        variant: "destructive",
      });
      return;
    }

    // Simular movimentação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const novoEstoque = data.tipo === 'entrada' 
      ? material.estoque + data.quantidade 
      : material.estoque - data.quantidade;
    
    console.log('Movimentação registrada:', { 
      materialId: material.id,
      materialNome: material.nome,
      ...data,
      estoqueAnterior: material.estoque,
      novoEstoque
    });
    
    toast({
      title: "Movimentação registrada!",
      description: `${data.tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${data.quantidade} unidades de ${material.nome}`,
    });

    onOpenChange(false);
    reset();
    onMovimentacaoCreated?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Movimentar Material
          </DialogTitle>
          <DialogDescription>
            Registre entrada ou saída de {material.nome}. Estoque atual: {material.estoque} unidades.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Movimentação</Label>
            <Select onValueChange={(value: 'entrada' | 'saida') => setValue('tipo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de movimentação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-600" />
                    Entrada
                  </div>
                </SelectItem>
                <SelectItem value="saida">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-600" />
                    Saída
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-sm text-red-500">Tipo de movimentação é obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              max={tipoMovimentacao === 'saida' ? material.estoque : undefined}
              placeholder="Digite a quantidade"
              {...register('quantidade', { 
                required: true,
                min: 1,
                valueAsNumber: true
              })}
            />
            {errors.quantidade && <p className="text-sm text-red-500">Quantidade deve ser maior que 0</p>}
            {tipoMovimentacao === 'saida' && (
              <p className="text-xs text-gray-500">Máximo disponível: {material.estoque} unidades</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Input
              id="motivo"
              placeholder="Ex: Aula prática, Reposição de estoque, Quebra"
              {...register('motivo', { required: true })}
            />
            {errors.motivo && <p className="text-sm text-red-500">Motivo é obrigatório</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre a movimentação"
              rows={3}
              {...register('observacoes')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={`${tipoMovimentacao === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              disabled={!tipoMovimentacao}
            >
              {tipoMovimentacao === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
