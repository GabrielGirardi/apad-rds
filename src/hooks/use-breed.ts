import { useQuery } from "@tanstack/react-query";


export function useBreed(enabled = true) {
  return useQuery({
    queryKey: ["breeds"],
    queryFn: async () => {
      const response = await fetch("/api/breed");
      if (!response.ok) {
        throw new Error("Erro ao carregar animais");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: enabled,
  });
}
