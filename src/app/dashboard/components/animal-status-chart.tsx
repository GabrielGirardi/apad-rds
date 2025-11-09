"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AnimalStatusChartProps {
  data: Record<string, number>
}

const statusLabels: Record<string, string> = {
  NEW_ARRIVAL: "Recém-chegado",
  ADOPTABLE: "Disponível para Adoção",
  TREATMENT: "Em Tratamento",
  UNSET: "Não Definido",
}

const COLORS = ["#962649", "#b83559", "#d94469", "#7c1f3a"];

export function AnimalStatusChart({ data }: AnimalStatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
  }));

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-foreground">Status dos Animais</CardTitle>
        <CardDescription className="text-muted-foreground">Distribuição dos animais por status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Quantidade",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
