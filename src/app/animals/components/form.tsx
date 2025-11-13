import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { Breed } from "@prisma/client";
import { toast } from "sonner";

import { saveAnimal } from "@/lib/api/animal";
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
  Image as ImageIcon,
  Settings,
  Tag,
  X,
  Save,
  ChevronDown,
  Layers,
  HelpCircle
} from "lucide-react";

type AnimalFormProps = {
  initialData?: {
    id: string;
    name: string;
    description?: string;
    species: 'DOG' | 'CAT' | 'OTHER';
    breed: Breed;
    gender: 'MALE' | 'FEMALE' | 'UNSET';
    imageUrl: string;
    status: 'NEW_ARRIVAL' | 'ADOPTABLE' | 'TREATMENT' | 'UNSET';
  };
};

type AnimalFormState = {
  type: 'edit' | 'create';
  onRefresh: () => void;
};

const breedOptions: Record<'DOG' | 'CAT' | 'OTHER', { value: Breed; label: string }[]> = {
  DOG: [
    { value: 'LABRADOR_RETRIEVER', label: 'Labrador Retriever' },
    { value: 'GOLDEN_RETRIEVER', label: 'Golden Retriever' },
    { value: 'GERMAN_SHEPHERD', label: 'Pastor Alemão' },
    { value: 'BULLDOG', label: 'Bulldog' },
    { value: 'POODLE', label: 'Poodle' },
    { value: 'BEAGLE', label: 'Beagle' },
    { value: 'DACHSHUND', label: 'Dachshund' },
    { value: 'SHIH_TZU', label: 'Shih Tzu' },
    { value: 'CHIHUAHUA', label: 'Chihuahua' },
    { value: 'MIXED_BREED_DOG', label: 'Vira-lata' },
  ],
  CAT: [
    { value: 'PERSIAN', label: 'Persa' },
    { value: 'SIAMESE', label: 'Siamês' },
    { value: 'MAINE_COON', label: 'Maine Coon' },
    { value: 'BENGAL', label: 'Bengal' },
    { value: 'SPHYNX', label: 'Sphynx' },
    { value: 'RAGDOLL', label: 'Ragdoll' },
    { value: 'BRITISH_SHORTHAIR', label: 'British Shorthair' },
    { value: 'RUSSIAN_BLUE', label: 'Russian Blue' },
    { value: 'MIXED_BREED_CAT', label: 'Vira-lata' },
  ],
  OTHER: [
    { value: 'OTHER', label: 'Outro' },
  ],
};


export default function AnimalForm({
  initialData,
  type,
  onRefresh
}: AnimalFormProps & AnimalFormState) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(initialData?.name || '');
  const [description, setDescription] = React.useState(initialData?.description || '');
  const [species, setSpecies] = React.useState<'DOG' | 'CAT' | 'OTHER'>(initialData?.species || 'DOG');
  const [breed, setBreed] = React.useState<Breed>(initialData?.breed || 'OTHER');
  const [gender, setGender] = React.useState(initialData?.gender || 'UNSET');
  const [imageUrl, setImageUrl] = React.useState(initialData?.imageUrl || '');
  const [status, setStatus] = React.useState(initialData?.status || 'UNSET');

  const isEditing = !!initialData;
  const mutation = useMutation({
    mutationFn: () =>
      saveAnimal({
        name,
        description,
        species,
        breed,
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
      setSpecies('DOG');
      setBreed('OTHER');
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
              <Label htmlFor="species" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                  Espécie
              </Label>
              <Select value={species} onValueChange={(value: string) => setSpecies(value as 'DOG' | 'CAT' | 'OTHER')}>
                <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                    <SelectValue placeholder="Selecione uma espécie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOG">
                      <div className="flex items-center gap-2">
                      <span>Cachorro</span>
                      </div>
                  </SelectItem>
                  <SelectItem value="CAT">
                      <div className="flex items-center gap-2">
                      <span>Gato</span>
                      </div>
                  </SelectItem>
                  <SelectItem value="OTHER">
                      <div className="flex items-center gap-2">
                      <span>Outro</span>
                      </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                Raça
              </Label>
              <Select value={breed} onValueChange={(value: Breed) => setBreed(value)} disabled={!species}>
                <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                  <SelectValue placeholder={species ? 'Selecione uma raça' : 'Selecione uma espécie primeiro'} />
                </SelectTrigger>
                <SelectContent>
                {(species === 'DOG' || species === 'CAT' || species === 'OTHER') &&
                  breedOptions[species].map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
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
              <Select value={gender} onValueChange={(value: 'MALE' | 'FEMALE' | 'UNSET') => setGender(value)}>
                <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNSET">Não definido</SelectItem>
                  <SelectItem value="MALE">Macho</SelectItem>
                  <SelectItem value="FEMALE">Fêmea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Status
              </Label>
              <Select value={status} onValueChange={(value: 'UNSET' | 'NEW_ARRIVAL' | 'ADOPTABLE' | 'TREATMENT') => setStatus(value)}>
                <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNSET">Não definido</SelectItem>
                  <SelectItem value="NEW_ARRIVAL">Recém-chegado</SelectItem>
                  <SelectItem value="ADOPTABLE">Adotável</SelectItem>
                  <SelectItem value="ADOPTED">Adotado</SelectItem>
                  <SelectItem value="TREATMENT">Em tratamento</SelectItem>
                </SelectContent>
              </Select>
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
                <ImageIcon className="w-4 h-4" />
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
