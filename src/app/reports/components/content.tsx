"use client"

import { useState, useMemo } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { CheckCircle2, Clock, FileText, Plus, Search, XCircle, PawPrint, Timer } from "lucide-react";

import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getReports, saveReport, deleteReport, type Report, type ReportPayload } from "@/lib/api/report";
import { ReportCard } from "./report-card";
import { ReportDialog } from "./report-dialog";
import { StatsCard } from "./stats-card";

export default function ReportsPageContent() {
  const { data: reports, mutate, isLoading } = useSWR<Report[]>("reports", getReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");

  const { isViewer, loading } = useSession();

  const filteredReports = useMemo(() => {
    if (!reports) return []

    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === "all" || report.status === filterStatus;

      return matchesSearch && matchesStatus
    })
  }, [reports, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    if (!reports) return { total: 0, awaiting: 0, inProgress: 0, completed: 0, rejected: 0 };

    return {
      total: reports.length,
      awaiting: reports.filter((r) => r.status === "AWAITING").length,
      inProgress: reports.filter((r) => r.status === "IN_PROGRESS").length,
      completed: reports.filter((r) => r.status === "COMPLETED").length,
      rejected: reports.filter((r) => r.status === "REJECTED").length,
    }
  }, [reports]);

  const handleSave = async (data: ReportPayload, id?: string) => {
    try {
      await saveReport(data, id);
      mutate();
      toast.success(id ? "Denúncia atualizada com sucesso!" : "Denúncia criada com sucesso!");
    } catch (error) {
      toast.error("Não foi possível salvar a denúncia.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta denúncia? Esta ação não pode ser desfeita.")) return;

    try {
      await deleteReport(id);
      mutate();
      toast.success("Denúncia excluída com sucesso.");
    } catch (error) {
      toast.error("Não foi possível excluir a denúncia.");
      console.error(error);
    }
  };

  const handleCreate = () => {
    setSelectedReport(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setDialogMode("view");
    setDialogOpen(true);
  };

  if (loading) return null;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance flex items-center gap-3">
                <PawPrint className="h-9 w-9 text-primary" />
                Denúncias de Animais
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie denúncias de animais resgatados e em situação de risco
              </p>
            </div>
            <Button onClick={handleCreate} size="lg" className="gap-2" hidden={isViewer}>
              <Plus className="h-5 w-5" />
              Nova Denúncia
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard title="Total" value={stats.total} icon={FileText} color="bg-primary/10 text-primary" />
            <StatsCard
              title="Aguardando"
              value={stats.awaiting}
              icon={Clock}
              description="Aguardando análise"
              color="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500"
            />
            <StatsCard
              title="Em Andamento"
              value={stats.inProgress}
              icon={Timer}
              description="Sendo processadas"
              color="bg-blue-500/10 text-blue-600 dark:text-blue-500"
            />
            <StatsCard
              title="Concluídas"
              value={stats.completed}
              icon={CheckCircle2}
              description="Finalizadas"
              color="bg-green-500/10 text-green-600 dark:text-green-500"
            />
            <StatsCard
              title="Rejeitadas"
              value={stats.rejected}
              icon={XCircle}
              description="Não procedentes"
              color="bg-red-500/10 text-red-600 dark:text-red-500"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição, endereço ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="AWAITING">Aguardando</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="UNDER_REVIEW">Em Análise</SelectItem>
                <SelectItem value="APPROVED">Aprovado</SelectItem>
                <SelectItem value="REJECTED">Rejeitado</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                <SelectItem value="ON_HOLD">Em Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-56 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <PawPrint className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma denúncia encontrada</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {searchTerm || filterStatus !== "all"
                  ? "Tente ajustar os filtros de busca para encontrar denúncias."
                  : "Comece criando a primeira denúncia de animal resgatado ou em situação de risco."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Button onClick={handleCreate} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Primeira Denúncia
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isViewer={isViewer}
                />
              ))}
            </div>
          )}
        </div>

        <ReportDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          report={selectedReport}
          onSave={handleSave}
          mode={dialogMode}
        />
      </div>
    </>
  )
}
