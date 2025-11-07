export type BreedPayload = {
    name: string;
  };

  export async function getBreeds() {
    const res = await fetch('/api/breed');

    if (!res.ok) {
      throw new Error('Erro ao buscar raças');
    }

    return res.json();
  }

  export async function saveBreed(data: BreedPayload, id?: string | undefined) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/breed/${id}` : '/api/breed';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar a raça');
    }

    return res.json();
  }

  export async function changeBreedName(id: string, name: string) {
    const res = await fetch(`/api/breed/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error('Erro ao alterar o nome da raça');
    }

    return res.json();
  }

  export async function deleteBreed(id: string) {
    const res = await fetch(`/api/breed/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Erro ao excluir a raça');
    }

    return res.json();
  }
