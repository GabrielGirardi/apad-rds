export type EventPayload = {
    title: string;
    description?: string;
    tags: string[];
    finishAt: string;
    isActive: boolean;
  };

  export async function getEvents() {
    const res = await fetch('/api/event');

    if (!res.ok) {
      throw new Error('Erro ao buscar eventos');
    }

    return res.json();
  }

  export async function saveEvent(data: EventPayload, id?: string | undefined) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/event/${id}` : '/api/event';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar o evento');
    }

    return res.json();
  }

  export async function changeEventStatus(id: string, isActive: boolean) {
    const res = await fetch(`/api/event/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });

    if (!res.ok) {
      throw new Error('Erro ao alterar o status do evento');
    }

    return res.json();
  }

  export async function deleteEvent(id: string) {
    const res = await fetch(`/api/event/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Erro ao excluir o evento');
    }

    return res.json();
  }
  