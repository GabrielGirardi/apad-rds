"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Report, ReportPayload } from "@/lib/api/report"
import { Loader2, X } from "lucide-react"

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report?: Report | null
  onSave: (data: ReportPayload, id?: string) => Promise<void>
  mode: "create" | "edit" | "view"
}

export function ReportDialog({ open, onOpenChange, report, onSave, mode }: ReportDialogProps) {
  const [formData, setFormData] = useState<ReportPayload>({
    title: "",
    description: "",
    address: "",
    tags: [],
    status: "AWAITING",
  })
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        description: report.description || "",
        address: report.address || "",
        tags: report.tags || [],
        status: report.status,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        address: "",
        tags: [],
        status: "AWAITING",
      })
    }
    setTagInput("")
  }, [report, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData, report?.id)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Nova Denúncia de Animal"}
            {mode === "edit" && "Editar Denúncia"}
            {mode === "view" && "Detalhes da Denúncia"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Preencha as informações sobre o animal resgatado ou em situação de risco."}
            {mode === "edit" && "Atualize as informações da denúncia."}
            {mode === "view" && "Visualize os detalhes completos da denúncia."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Cachorro abandonado na Rua A"
                required
                disabled={isReadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Endereço / Localização</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                disabled={isReadOnly}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ReportPayload["status"] })}
                disabled={isReadOnly}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags / Características</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Cachorro, Ferido, Urgente"
                  disabled={isReadOnly}
                />
                {!isReadOnly && (
                  <Button type="button" onClick={handleAddTag} variant="secondary">
                    Adicionar
                  </Button>
                )}
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {formData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {tag}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva as condições do animal, comportamento, possíveis ferimentos, etc..."
                rows={5}
                disabled={isReadOnly}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? "Fechar" : "Cancelar"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Criar Denúncia" : "Salvar Alterações"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
