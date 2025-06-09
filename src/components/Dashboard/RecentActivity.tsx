
import { Clock, User, FlaskConical, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    type: "agendamento",
    user: "Prof. Maria Silva",
    action: "agendou o laboratório",
    details: "Química - 3ª aula - Turma A",
    time: "há 2 horas",
    icon: Calendar,
  },
  {
    id: 2,
    type: "material",
    user: "Técnico João",
    action: "adicionou material",
    details: "Kit de Microscopia (10 unidades)",
    time: "há 3 horas",
    icon: FlaskConical,
  },
  {
    id: 3,
    type: "agendamento",
    user: "Prof. Carlos Santos",
    action: "cancelou agendamento",
    details: "Física - 5ª aula - Turma B",
    time: "há 5 horas",
    icon: Calendar,
  },
  {
    id: 4,
    type: "material",
    user: "Coordenadora Ana",
    action: "baixa de material",
    details: "Tubo de ensaio (5 unidades)",
    time: "ontem",
    icon: FlaskConical,
  },
];

export const RecentActivity = () => {
  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Clock className="w-5 h-5 text-blue-600" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="p-2 bg-blue-100 rounded-full">
                <activity.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  <span className="text-blue-600">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
