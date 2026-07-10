import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";

export type ApiKeyRecord = {
  id: string;
  label: string;
  keyHint: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export type CreateApiKeyRequest = {
  label: string;
};

export type CreateApiKeyResponse = {
  key: ApiKeyRecord & { secret: string };
};

export type UpdateApiKeyRequest = {
  label: string;
};

const AUTH_REQUEST = { requireAuth: true } as const;

const listApiKeys = async (): Promise<ApiKeyRecord[]> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.API_KEYS, AUTH_REQUEST);
  const payload = assertApiSuccess<{ data: ApiKeyRecord[] } | ApiKeyRecord[]>(response);
  return Array.isArray(payload) ? payload : (payload.data ?? []);
};

const createApiKey = async (data: CreateApiKeyRequest): Promise<CreateApiKeyResponse> => {
  const response = await ApiService.post(API_ROUTES.ADMIN.API_KEYS, data, AUTH_REQUEST);
  const payload = assertApiSuccess<
    (ApiKeyRecord & { secret: string; message?: string }) | CreateApiKeyResponse
  >(response);

  if ("key" in payload && payload.key) {
    return payload;
  }

  const flat = payload as ApiKeyRecord & { secret: string };
  return {
    key: {
      id: flat.id,
      label: flat.label,
      keyHint: flat.keyHint,
      createdAt: flat.createdAt,
      lastUsedAt: flat.lastUsedAt,
      secret: flat.secret,
    },
  };
};

const updateApiKey = async (id: string, data: UpdateApiKeyRequest): Promise<ApiKeyRecord> => {
  const response = await ApiService.patch(`${API_ROUTES.ADMIN.API_KEYS}/${id}`, data, AUTH_REQUEST);
  return assertApiSuccess<ApiKeyRecord>(response);
};

const revokeApiKey = async (id: string): Promise<{ message: string }> => {
  const response = await ApiService.delete(`${API_ROUTES.ADMIN.API_KEYS}/${id}`, AUTH_REQUEST);
  return assertApiSuccess<{ message: string }>(response);
};

export { createApiKey, listApiKeys, revokeApiKey, updateApiKey };
