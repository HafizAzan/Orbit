import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  updateApiKey,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
} from "../api-services/admin-api-keys.service";

const QUERY_KEY = "admin-api-keys";

export function useApiKeys() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: listApiKeys,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => createApiKey(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApiKeyRequest }) => updateApiKey(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
