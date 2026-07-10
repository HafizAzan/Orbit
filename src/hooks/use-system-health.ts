import { useQuery } from "@tanstack/react-query";
import { getSystemHealth } from "../api-services/health.service";

export function useSystemHealth() {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: getSystemHealth,
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}
