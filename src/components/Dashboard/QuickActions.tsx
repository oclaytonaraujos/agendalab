
import { Plus, Calendar, FlaskConical, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Novo Agendamento",
    description: "Agendar uso do laboratório",
    icon: Calendar,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Adicionar Material",
    description: "Cadastrar novo material",
    icon: FlaskConical,
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    title: "Gerar Relatório",
    description: "Relatório de uso e materiais",
    icon: FileText,
    color: "bg-purple-600 hover:bg-purple-700",
  },
];

export const QuickActions = () => {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Plus className="w-5 h-5 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start h-auto p-4 border-2 border-gray-200 hover:border-blue-300 transition-all group`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
