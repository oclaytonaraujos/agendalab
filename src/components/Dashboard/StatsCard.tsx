
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend = "neutral",
  trendValue 
}: StatsCardProps) => {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">
            {description}
            {trendValue && (
              <span className={`ml-1 ${trendColors[trend]}`}>
                {trendValue}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
