"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, MapPin } from "lucide-react"
import type { Report } from "@/lib/api/report"

interface ReportCardProps {
  report: Report
  onView: (report: Report) => void
  onEdit: (report: Report) => void
  onDelete: (id: string) => void
}

const statusColors = {
  AWAITING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  IN_PROGRESS: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  UNDER_REVIEW: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  APPROVED: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  ON_HOLD: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
}

const statusLabels = {
  AWAITING: "Aguardando",
  IN_PROGRESS: "Em Andamento",
  UNDER_REVIEW: "Em Análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  ON_HOLD: "Em Espera",
}

export function ReportCard({ report, onView, onEdit, onDelete }: ReportCardProps) {
  const statusKey = report.status as keyof typeof statusColors

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/30 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-2">
          <CardTitle className="text-lg font-semibold leading-tight text-balance">{report.title}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={statusColors[statusKey] || statusColors.AWAITING}>
              {statusLabels[statusKey] || report.status}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(report)}>
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(report)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(report.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
          {report.description || "Sem descrição"}
        </p>
        {report.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{report.address}</span>
          </div>
        )}
        {report.tags && report.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {report.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {report.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{report.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        {report.createdAt && (
          <p className="text-xs text-muted-foreground pt-1 border-t">
            Criada em:{" "}
            {new Date(report.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
