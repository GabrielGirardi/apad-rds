import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, FileText, PawPrint, Calendar, Heart, Search } from "lucide-react";

interface StatsCardsProps {
  data: {
    totalPeople: number;
    totalUsers: number;
    totalReports: number;
    totalAnimals: number;
    totalCampaigns: number;
    totalEvents: number;
    totalBreeds: number;
  }
}

export function StatsCards({ data }: StatsCardsProps) {
  const cards = [
    {
      title: "Pessoas Cadastradas",
      description: "Total de pessoas no sistema",
      value: data.totalPeople,
      icon: Users,
      color: "from-[#962649] to-[#b83559]",
    },
    {
      title: "Usuários Ativos",
      description: "Usuários com acesso ao sistema",
      value: data.totalUsers,
      icon: UserCheck,
      color: "from-[#7c1f3a] to-[#962649]",
    },
    {
      title: "Denúncias",
      description: "Total de denúncias registradas",
      value: data.totalReports,
      icon: FileText,
      color: "from-[#b83559] to-[#d94469]",
    },
    {
      title: "Animais",
      description: "Animais cadastrados",
      value: data.totalAnimals,
      icon: PawPrint,
      color: "from-[#6a1b32] to-[#7c1f3a]",
    },
    {
      title: "Campanhas",
      description: "Campanhas de arrecadação",
      value: data.totalCampaigns,
      icon: Heart,
      color: "from-[#962649] to-[#b83559]",
    },
    {
      title: "Eventos",
      description: "Eventos programados",
      value: data.totalEvents,
      icon: Calendar,
      color: "from-[#7c1f3a] to-[#962649]",
    },
    {
      title: "Raças",
      description: "Raças catalogadas",
      value: data.totalBreeds,
      icon: Search,
      color: "from-[#b83559] to-[#d94469]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={index}
            className="border-none bg-gradient-to-br shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-card dark:text-card-foreground"
            style={{
              backgroundImage: `linear-gradient(135deg, ${card.color.split(" ")[0].replace("from-", "")}, ${card.color.split(" ")[1].replace("to-", "")})`,
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-black dark:text-white/90">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-foreground" />
              </div>
              <CardDescription className="text-foreground dark:text-white/70 text-xs">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black dark:text-white">{card.value.toLocaleString("pt-BR")}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
