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