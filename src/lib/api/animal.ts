export type AnimalPayload = {
    name: string;
    description: string;
    species: string;
    breed: string;
    gender: 'MALE' | 'FEMALE' | 'UNSET';
    imageUrl: string;
    status: 'NEW_ARRIVAL' | 'ADOPTABLE' | 'TREATMENT' | 'UNSET';
}

export async function getAnimals() {
    const res = await fetch('/api/animal');

    if (!res.ok) {
        throw new Error('Erro ao buscar animais');
    }

    return res.json();
}
