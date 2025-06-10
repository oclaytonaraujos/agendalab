
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MaterialForm {
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  localizacao: string;
  descricao?: string;
}

const categorias = [
  'Vidraria',
  'Equipamento',
  'Químico',
  'Consumível',
  'Instrumento',
  'Eletrônico',
  'Outro'
];

interface NovoMaterialModalProps {
  onMaterialCreated?: () => void;
}

export const NovoMaterialModal = ({ onMaterialCreated }: NovoMaterialModalProps) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<MaterialForm>();
  const { toast } = useToast();
  const { user } = useAuth();

  // Verificar se usuário tem permissão para cadastrar material
  const canAddMaterial = user?.role === 'admin' || user?.role === 'coordenacao';

  const onSubmit = async (data: MaterialForm) => {
    // Simular criação do material
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Novo material:', data);
    
    toast({
      title: "Material cadastrado!",
      description: `${data.nome} foi adicionado ao estoque com sucesso.`,
    });

    setOpen(false);
    reset();
    onMaterialCreated?.();
  };

  if (!canAddMaterial) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
          <DialogDescription>
            Cadastre um novo material no sistema de controle de estoque.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Material</Label>
              <Input
                id="nome"
                placeholder="Ex: Tubos de Ensaio"
                {...register('nome', { required: 'Nome é obrigatório' })}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select onValueChange={(value) => setValue('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque Atual</Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                placeholder="0"
                {...register('estoque', { 
                  required: 'Estoque é obrigatório',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Estoque deve ser maior ou igual a 0' }
                })}
              />
              {errors.estoque && <p className="text-sm text-red-500">{errors.estoque.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                min="0"
                placeholder="0"
                {...register('estoqueMinimo', { 
                  required: 'Estoque mínimo é obrigatório',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Estoque mínimo deve ser maior ou igual a 0' }
                })}
              />
              {errors.estoqueMinimo && <p className="text-sm text-red-500">{errors.estoqueMinimo.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              placeholder="Ex: Armário A1, Mesa Central"
              {...register('localizacao', { required: 'Localização é obrigatória' })}
            />
            {errors.localizacao && <p className="text-sm text-red-500">{errors.localizacao.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Informações adicionais sobre o material"
              {...register('descricao')}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Cadastrar Material
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
