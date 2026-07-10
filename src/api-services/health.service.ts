import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";

export type SystemHealthCheck = {
  name: string;
  status: "up" | "down";
  latencyMs?: number;
  detail?: string;
};

export type SystemHealthResponse = {
  status: "ok" | "degraded";
  service: string;
  timestamp: string;
  checks: SystemHealthCheck[];
};

const getSystemHealth = async (): Promise<SystemHealthResponse> => {
  const response = await ApiService.get(API_ROUTES.HEALTH.ROOT);
  return assertApiSuccess<SystemHealthResponse>(response);
};

export { getSystemHealth };
