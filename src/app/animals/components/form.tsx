import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { saveAnimal } from "@/lib/api/animal";
import { toast } from "sonner";

import { useBreed } from "@/hooks/use-breed";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Plus,
  PawPrint,
  Image,
  Settings,
  Tag,
  X,
  Save,
  ChevronDown,
  Layers,
  Venus,
  Mars,
  HelpCircle
} from "lucide-react";

type AnimalFormProps = {
  initialData?: {
    id: string;
    name: string;
    description?: string;
    species: string;
    breedId: string;
    gender: 'MALE' | 'FEMALE' | 'UNSET';
    imageUrl: string;
    status: 'NEW_ARRIVAL' | 'ADOPTABLE' | 'TREATMENT' | 'UNSET';
  };
};

type breedData = {
    id: string;
    name: string;
};

type AnimalFormState = {
  type: 'edit' | 'create';
  onRefresh: () => void;
};

export default function AnimalForm({
  initialData,
  type,
  onRefresh
}: AnimalFormProps & AnimalFormState) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [species, setSpecies] = React.useState(initialData?.species || '');
  const [breed, setBreed] = React.useState(initialData?.breedId || '');
  const [gender, setGender] = React.useState(initialData?.gender || 'UNSET');
  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl || '');
  const [status, setStatus] = React.useState(initialData?.status || 'UNSET');
  
  const { data, isLoading } = useBreed(open);

  const isEditing = !!initialData;
  const mutation = useMutation({
    mutationFn: () =>
      saveAnimal({
        name,
        description,
        species,
        breedId: breed,
        gender,
        imageUrl,
        status
      }, initialData?.id),
    onSuccess: () => {
      toast.success(isEditing ? 'Animal atualizado com sucesso!' : 'Animal cadastrado com sucesso!');
      onRefresh?.();
      setOpen(false);
      setName('');
      setDescription('');
      setSpecies('');
      setBreed('');
      setGender('UNSET');
      setImageUrl('');
      setStatus('UNSET');
    },
    onError: () => {
      toast.error('Erro ao salvar o animal');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error('O nome é obrigatório');
    if (!species.trim()) return toast.error('A espécie é obrigatória');
    if (!breed.trim()) return toast.error('A raça é obrigatória');
    if (!gender) return toast.error('O gênero é obrigatório');
    if (!status) return toast.error('O status é obrigatório');
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
            {isEditing ? "Editar Animal" : "Cadastrar Animal"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados do animal abaixo." : "Preencha os dados para cadastrar um novo animal."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <PawPrint className="w-4 h-4" />
                Nome
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Espécie
              </Label>
              <Input id="species" value={species} onChange={(e) => setSpecies(e.target.value)} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="person" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                    Raça
                </Label>
                <Select value={breed} onValueChange={setBreed}>
                    <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                        <SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione uma raça'} />
                    </SelectTrigger>
                    <SelectContent>
                        {data?.map((breed: breedData) => (
                        <SelectItem key={breed.id} value={breed.id}>
                            <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            <span>{breed.name}</span>
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4" />
                Gênero
              </Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-11 border border-gray-300 rounded-md px-3"
              >
                <option value="UNSET">Não definido</option>
                <option value="MALE">Macho</option>
                <option value="FEMALE">Fêmea</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 border border-gray-300 rounded-md px-3"
              >
                <option value="UNSET">Não definido</option>
                <option value="NEW_ARRIVAL">Recém-chegado</option>
                <option value="ADOPTABLE">Adotável</option>
                <option value="TREATMENT">Em tratamento</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Descrição
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Informações adicionais sobre o animal"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                URL da Imagem
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
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
