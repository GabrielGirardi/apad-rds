export type AnimalPayload = {
  name: string;
  description: string;
  species: string;
  breedId: string;
  gender: 'MALE' | 'FEMALE' | 'UNSET';
  imageUrl: string;
  status: 'NEW_ARRIVAL' | 'ADOPTABLE' | 'TREATMENT' | 'UNSET';
};

export async function getAnimals() {
  const res = await fetch('/api/animal');

  if (!res.ok) {
    throw new Error('Erro ao buscar animais');
  }

  return res.json();
}

export async function saveAnimal(data: AnimalPayload, id?: string | undefined) {
  const method = id ? 'PUT' : 'POST';
  const endpoint = id ? `/api/animal/${id}` : '/api/animal';

  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao salvar o animal');
  }

  return res.json();
}

export async function changeAnimalStatus(id: string, status: AnimalPayload['status']) {
  const res = await fetch(`/api/animal/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Erro ao alterar o status do animal');
  }

  return res.json();
}

export async function deleteAnimal(id: string) {
  const res = await fetch(`/api/animal/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erro ao excluir o animal');
  }

  return res.json();
}
