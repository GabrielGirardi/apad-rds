import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface QuickStatsProps {
  data: {
    totalAnimals: number;
    totalReports: number;
    totalCampaigns: number;
    totalEvents: number;
    reportStatusSummary: Record<string, number>;
    animalStatusSummary: Record<string, number>;
  }
}

export function QuickStats({ data }: QuickStatsProps) {
  const adoptableAnimals = data.animalStatusSummary.ADOPTABLE || 0;
  const pendingReports = (data.reportStatusSummary.AWAITING || 0) + (data.reportStatusSummary.IN_PROGRESS || 0);
  const completedReports = data.reportStatusSummary.COMPLETED || 0;

  const stats = [
    {
      title: "Animais para Adoção",
      value: adoptableAnimals,
      description: "Disponíveis no momento",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Denúncias Pendentes",
      value: pendingReports,
      description: "Aguardando ou em progresso",
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Denúncias Concluídas",
      value: completedReports,
      description: "Finalizados com sucesso",
      icon: CheckCircle,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border/50 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
