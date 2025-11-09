"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ReportStatusChartProps {
  data: Record<string, number>;
}

const statusLabels: Record<string, string> = {
  AWAITING: "Aguardando",
  IN_PROGRESS: "Em Progresso",
  UNDER_REVIEW: "Em Análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  ON_HOLD: "Em Espera",
}

export function ReportStatusChart({ data }: ReportStatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    status: statusLabels[status] || status,
    count,
  }));

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Status das Denúncias</CardTitle>
        <CardDescription className="text-muted-foreground">Distribuição das denúncias por status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Quantidade",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="status"
                angle={-45}
                textAnchor="end"
                height={100}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#962649" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
