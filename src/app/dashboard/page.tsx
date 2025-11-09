import AuthGuard from "@/components/auth/auth-guard";
import { getDashboardData } from "@/lib/dashboard";
import { StatsCards } from "./components/stats-cards";
import { ReportStatusChart } from "./components/report-status-chart";
import { AnimalStatusChart } from "./components/animal-status-chart";
import { QuickStats } from "./components/quick-stats";

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 md:p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do sistema de gestão</p>
          </div>

          <StatsCards data={data} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ReportStatusChart data={data.reportStatusSummary} />
            <AnimalStatusChart data={data.animalStatusSummary} />
          </div>

          {/* Quick Stats */}
          <QuickStats data={data} />
        </div>
      </div>
    </AuthGuard>
  )
}
