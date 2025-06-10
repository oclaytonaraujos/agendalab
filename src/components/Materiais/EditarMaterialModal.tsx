
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

interface Material {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  minimo: number;
  localizacao: string;
  status: string;
}

interface EditarMaterialModalProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialUpdated: () => void;
}

export const EditarMaterialModal = ({ 
  material, 
  open, 
  onOpenChange,
  onMaterialUpdated 
}: EditarMaterialModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    estoque: 0,
    minimo: 0,
    localizacao: "",
  });

  useEffect(() => {
    if (material) {
      setFormData({
        nome: material.nome,
        categoria: material.categoria,
        estoque: material.estoque,
        minimo: material.minimo,
        localizacao: material.localizacao,
      });
    }
  }, [material]);

  // Verificar se o usuário tem permissão para editar
  const canEdit = user?.role === 'admin' || user?.role === 'coordenacao';

  if (!canEdit) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Editando material:", {
      id: material?.id,
      ...formData
    });

    // Aqui você implementaria a lógica para atualizar o material
    // Por exemplo, uma chamada para API ou atualização do estado
    
    onMaterialUpdated();
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Material</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Material</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Ex: Tubos de Ensaio"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              value={formData.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              placeholder="Ex: Vidraria"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque Atual</Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) => handleChange("estoque", parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimo">Estoque Mínimo</Label>
              <Input
                id="minimo"
                type="number"
                value={formData.minimo}
                onChange={(e) => handleChange("minimo", parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => handleChange("localizacao", e.target.value)}
              placeholder="Ex: Armário A1"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
