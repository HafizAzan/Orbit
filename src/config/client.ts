import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { ApiRequestError } from "../lib/api-error";
import { getAccessToken } from "../lib/cookies";

const BASE_URL = import.meta.env.VITE_API_URL;

export type ApiRequestOptions = AxiosRequestConfig & {
  requireAuth?: boolean;
};

const apiSauceInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function applyRequestAuth(config: AxiosRequestConfig, requireAuth = false) {
  const token = getAccessToken();

  if (requireAuth && !token) {
    throw new ApiRequestError("Authentication required.");
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

apiSauceInstance.interceptors.request.use((config) => {
  const requireAuth = (config as ApiRequestOptions).requireAuth ?? false;
  applyRequestAuth(config, requireAuth);

  const method = config.method?.toLowerCase();
  const hasBody = config.data !== undefined && config.data !== null;

  if (!hasBody && method && ["post", "put", "patch"].includes(method)) {
    delete config.headers["Content-Type"];
  }

  return config;
});

const ApiResponseHandler = (response: AxiosResponse) => response?.data ?? response;
const ApiErrorHandler = (error: AxiosError) => error?.response?.data ?? error;

const ApiReqHandler = async (
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data?: unknown,
  requestConfigOverrides: ApiRequestOptions = {},
  isReturnAllResponse: boolean = false,
) => {
  try {
    const { requireAuth, ...requestConfig } = requestConfigOverrides;

    const requestConfigFinal: ApiRequestOptions = {
      method,
      url,
      requireAuth,
      ...requestConfig,
    };

    if (data !== null && data !== undefined) {
      requestConfigFinal.data = data;
    }

    const response = await apiSauceInstance.request(requestConfigFinal);
    return isReturnAllResponse ? response : ApiResponseHandler(response);
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    return ApiErrorHandler(error as AxiosError);
  }
};

const ApiService = {
  get: (url: string, requestConfig: ApiRequestOptions = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("get", url, undefined, requestConfig, isReturnAllResponse),

  post: (url: string, data?: unknown, requestConfig: ApiRequestOptions = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("post", url, data, requestConfig, isReturnAllResponse),

  put: (url: string, data?: unknown, requestConfig: ApiRequestOptions = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("put", url, data, requestConfig, isReturnAllResponse),

  patch: (url: string, data?: unknown, requestConfig: ApiRequestOptions = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("patch", url, data, requestConfig, isReturnAllResponse),

  delete: (url: string, requestConfig: ApiRequestOptions = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("delete", url, undefined, requestConfig, isReturnAllResponse),
};

export default ApiService;
