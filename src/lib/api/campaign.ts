export type CampaignPayload = {
    title: string;
    description?: string;
    targetAmount?: number;
    finishAt: string;
    isActive: boolean;
  };

  export async function getCampaigns() {
    const res = await fetch('/api/campaign');

    if (!res.ok) {
      throw new Error('Erro ao buscar campanhas');
    }

    return res.json();
  }

  export async function saveCampaign(data: CampaignPayload, id?: string | undefined) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/campaign/${id}` : '/api/campaign';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar a campanha');
    }

    return res.json();
  }

  export async function changeCampaignStatus(id: string, isActive: boolean) {
    const res = await fetch(`/api/campaign/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });

    if (!res.ok) {
      throw new Error('Erro ao alterar o status da campanha');
    }

    return res.json();
  }

  export async function deleteCampaign(id: string) {
    const res = await fetch(`/api/campaign/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Erro ao excluir a campanha');
    }

    return res.json();
  }
