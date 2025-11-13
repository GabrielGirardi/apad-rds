import { Breed } from "@prisma/client";

export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const animalStatusTranslate = (value: string) => {
  switch (value) {
    case 'NEW_ARRIVAL':
      return 'Nova chegada';
    case 'ADOPTABLE':
      return 'Pronto Para Adoção';
    case 'TREATMENT':
      return 'Em Tratamento';
    default: 
      return 'Não Definido'
  }
}

export function translateBreedToPtBr(breed: Breed): string {
  const translations: Record<Breed, string> = {
    // 🐶 Cachorros
    LABRADOR_RETRIEVER: "Labrador Retriever",
    GOLDEN_RETRIEVER: "Golden Retriever",
    GERMAN_SHEPHERD: "Pastor Alemão",
    BULLDOG: "Bulldog",
    POODLE: "Poodle",
    BEAGLE: "Beagle",
    DACHSHUND: "Basset (Cofap)",
    SHIH_TZU: "Shih Tzu",
    CHIHUAHUA: "Chihuahua",
    MIXED_BREED_DOG: "Vira-lata (Cachorro)",

    // 🐱 Gatos
    PERSIAN: "Persa",
    SIAMESE: "Siamês",
    MAINE_COON: "Maine Coon",
    BENGAL: "Bengal",
    SPHYNX: "Sphynx",
    RAGDOLL: "Ragdoll",
    BRITISH_SHORTHAIR: "British Shorthair",
    RUSSIAN_BLUE: "Azul Russo",
    MIXED_BREED_CAT: "Vira-lata (Gato)",

    // Outros
    OTHER: "Outra"
  };

  return translations[breed] ?? "Desconhecido";
}
