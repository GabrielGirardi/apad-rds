import AuthGuard from "@/components/auth/auth-guard";
import { getDashboardData } from "@/lib/dashboard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface DashboardData {
  totalPeople: number;
  totalUsers: number;
}

export default async function Dashboard() {
  const {
    totalPeople,
    totalUsers
  }: DashboardData = await getDashboardData()

  const CardItems = [
    {
      title: 'Pessoas cadastradas',
      description: 'Total de pessoas cadastradas no sistema',
      value: totalPeople,
    },
    {
        title: 'Usuário cadastrados',
        description: 'Total de usuários cadastrados no sistema',
        value: totalUsers,
    }
  ]

  return (
    <AuthGuard>
      <div className="container mx-auto md:py-8 text-gray-500 p-4 md:p-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg font-bold dark:text-gray-200">Dashboard</h1>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {CardItems.map((card, index) => (
            <Card className="shadow-sm border-none bg-[#962649]/95 dark:bg-[#962649]/20" key={index}>
              <CardHeader>
                <CardTitle className="text-[#fafafa]">{card.title}</CardTitle>
                <CardDescription className="text-[#cccccc] dark:text-[#8b8789]">{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-4xl font-bold text-[#fafafa]">
                  { card.value }
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}