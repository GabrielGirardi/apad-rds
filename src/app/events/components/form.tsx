import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { saveEvent } from "@/lib/api/event";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  CalendarDays,
  Tag,
  Text,
  Settings,
  X,
  Save
} from "lucide-react";

type EventFormProps = {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    tags: string[];
    finishAt: string;
    isActive: boolean;
  };
};

type EventFormState = {
  type: 'edit' | 'create';
  onRefresh: () => void;
};

export default function EventForm({
                                    initialData,
                                    type,
                                    onRefresh
                                  }: EventFormProps & EventFormState) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState(initialData?.title || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [tags, setTags] = React.useState(initialData?.tags.join(', ') || '');
  const [finishAt, setFinishAt] = React.useState(
    initialData?.finishAt ? initialData.finishAt.split('T')[0] : ''
  );
  const [isActive, setIsActive] = React.useState<boolean>(initialData?.isActive ?? true);

  const isEditing = !!initialData;
  const mutation = useMutation({
    mutationFn: () =>
      saveEvent({
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        finishAt,
        isActive
      }, initialData?.id),
    onSuccess: () => {
      toast.success(isEditing ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
      onRefresh?.();
      setOpen(false);
      setTitle('');
      setDescription('');
      setTags('');
      setFinishAt('');
      setIsActive(true);
    },
    onError: () => {
      toast.error('Erro ao salvar o evento');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error('O título é obrigatório');
    if (!finishAt) return toast.error('A data de encerramento é obrigatória');
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === 'create' ? (
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">Adicionar</span>
          </Button>
        ) : (
          <span className="cursor-pointer flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            Editar
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isEditing ? "Editar Evento" : "Cadastrar Evento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do evento abaixo." : "Preencha os dados para cadastrar um novo evento."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Text className="w-4 h-4" />
                Título
              </Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags (separadas por vírgula)
              </Label>
              <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <Text className="w-4 h-4" />
                Descrição
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Informações adicionais sobre o evento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finishAt" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Data de Encerramento
              </Label>
              <Input
                type="date"
                id="finishAt"
                value={finishAt}
                onChange={(e) => setFinishAt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Status do Evento
              </Label>
              <div className="flex items-center space-x-3 h-11 px-3 border border-gray-300 rounded-md bg-muted">
                <Switch
                  id="status"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="status" className="text-sm cursor-pointer">
                  {isActive ? "Evento ativo" : "Evento inativo"}
                </Label>
                <div
                  className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isActive ? "Ativo" : "Inativo"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto h-11">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
