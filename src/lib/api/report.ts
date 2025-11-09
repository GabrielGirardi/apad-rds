export type ReportPayload = {
  title: string;
  description?: string;
  address?: string,
  tags: string[],
  status: 'AWAITING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
};

export type Report = ReportPayload & {
  id: string
  createdAt?: string
  updatedAt?: string
}

  export async function getReports() {
    const res = await fetch('/api/report');

    if (!res.ok) {
      throw new Error('Erro ao buscar denúncias');
    }

    return res.json();
  }

  export async function saveReport(data: ReportPayload, id?: string | undefined) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/api/report/${id}` : '/api/report';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Erro ao salvar o relatório');
    }

    return res.json();
  }

  export async function deleteReport(id: string) {
    const res = await fetch(`/api/report/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Erro ao excluir o relatório');
    }

    return res.json();
  }
  