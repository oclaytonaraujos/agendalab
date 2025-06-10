import { useState } from "react";
import { FlaskConical, Search, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NovoMaterialModal } from "@/components/Materiais/NovoMaterialModal";
import { MovimentarMaterialModal } from "@/components/Materiais/MovimentarMaterialModal";
import { EditarMaterialModal } from "@/components/Materiais/EditarMaterialModal";
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

const Materiais = () => {
  const { user } = useAuth();
  const [materiais, setMateriais] = useState<Material[]>([
    {
      id: 1,
      nome: "Tubos de Ensaio",
      categoria: "Vidraria",
      estoque: 5,
      minimo: 20,
      localizacao: "Armário A1",
      status: "baixo",
    },
    {
      id: 2,
      nome: "Microscópio Biológico",
      categoria: "Equipamento",
      estoque: 12,
      minimo: 10,
      localizacao: "Mesa Central",
      status: "ok",
    },
    {
      id: 3,
      nome: "Reagente HCl",
      categoria: "Químico",
      estoque: 8,
      minimo: 5,
      localizacao: "Armário Químicos",
      status: "ok",
    },
    {
      id: 4,
      nome: "Lâminas de Microscópio",
      categoria: "Consumível",
      estoque: 8,
      minimo: 25,
      localizacao: "Gaveta B2",
      status: "baixo",
    },
  ]);

  const [materialParaMovimentar, setMaterialParaMovimentar] = useState<Material | null>(null);
  const [modalMovimentarAberto, setModalMovimentarAberto] = useState(false);
  const [materialParaEditar, setMaterialParaEditar] = useState<Material | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);

  // Verificar se o usuário pode editar materiais
  const canEditMaterials = user?.role === 'admin' || user?.role === 'coordenacao';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
      case "baixo":
        return <Badge className="bg-orange-100 text-orange-800">Baixo</Badge>;
      case "critico":
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
    }
  };

  const handleMovimentar = (material: Material) => {
    setMaterialParaMovimentar(material);
    setModalMovimentarAberto(true);
  };

  const handleEditar = (material: Material) => {
    setMaterialParaEditar(material);
    setModalEditarAberto(true);
  };

  const onMovimentacaoCreated = () => {
    // Atualizar lista de materiais
    console.log("Nova movimentação criada - atualizando lista");
  };

  const onMaterialUpdated = () => {
    // Atualizar lista de materiais
    console.log("Material atualizado - atualizando lista");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <NovoMaterialModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">itens cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
            <p className="text-xs text-muted-foreground">necessitam reposição</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimentações Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-muted-foreground">entradas e saídas</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar materiais..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filtrar por Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-green-600" />
            Lista de Materiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materiais.map((material) => (
              <div
                key={material.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{material.nome}</h3>
                      {getStatusBadge(material.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span>
                        <strong>Categoria:</strong> {material.categoria}
                      </span>
                      <span>
                        <strong>Estoque:</strong> {material.estoque} unidades
                      </span>
                      <span>
                        <strong>Local:</strong> {material.localizacao}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              material.estoque <= material.minimo
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min((material.estoque / (material.minimo * 2)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          Min: {material.minimo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMovimentar(material)}
                    >
                      Movimentar
                    </Button>
                    {canEditMaterials && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditar(material)}
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MovimentarMaterialModal
        material={materialParaMovimentar}
        open={modalMovimentarAberto}
        onOpenChange={setModalMovimentarAberto}
        onMovimentacaoCreated={onMovimentacaoCreated}
      />

      <EditarMaterialModal
        material={materialParaEditar}
        open={modalEditarAberto}
        onOpenChange={setModalEditarAberto}
        onMaterialUpdated={onMaterialUpdated}
      />
    </div>
  );
};

export default Materiais;
