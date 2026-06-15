import { toast } from "./toast";

export class ApiRequestError extends Error {
  statusCode?: number;
  code?: string;
  email?: string;
  expiresAt?: string;

  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type ApiErrorBody = {
  statusCode?: number;
  message?: string | string[] | { message?: string };
  code?: string;
  email?: string;
  expiresAt?: string;
};

export function parseApiError(data: unknown): ApiRequestError {
  const error = data as ApiErrorBody & {
    code?: string;
    email?: string;
    expiresAt?: string;
  };
  const rawMessage = error?.message;

  let message = "";
  let code = error.code;
  let email = error.email;
  let expiresAt = error.expiresAt;

  if (typeof rawMessage === "string") {
    message = rawMessage;
  } else if (Array.isArray(rawMessage)) {
    message = rawMessage.join(", ");
  } else if (rawMessage && typeof rawMessage === "object") {
    const nested = rawMessage as {
      message?: string;
      code?: string;
      email?: string;
      expiresAt?: string;
    };
    message = nested.message ?? message;
    code = nested.code ?? code;
    email = nested.email ?? email;
    expiresAt = nested.expiresAt ?? expiresAt;
  }

  const apiError = new ApiRequestError(message);
  apiError.statusCode = error?.statusCode;
  apiError.code = code;
  apiError.email = email;
  apiError.expiresAt = expiresAt;

  return apiError;
}

export function assertApiSuccess<T>(data: unknown): T {
  const error = data as ApiErrorBody;

  if (error?.statusCode && error.statusCode >= 400) {
    throw parseApiError(data);
  }

  return data as T;
}

export const AUTH_ERROR_CODES = {
  PENDING_EMAIL_VERIFICATION: "PENDING_EMAIL_VERIFICATION",
} as const;

export function getApiErrorMessage(error: unknown): string | null {
  if (error instanceof ApiRequestError || error instanceof Error) {
    const message = error.message.trim();
    return message || null;
  }

  return null;
}

export function showApiErrorToast(error: unknown) {
  const message = getApiErrorMessage(error);
  if (message) {
    toast.error(message);
  }
}

export function showApiInfoToast(message: string | null | undefined) {
  const normalized = message?.trim();
  if (normalized) {
    toast.info(normalized);
  }
}

export function showApiSuccessToast(message: string | null | undefined, devDetail?: string | null) {
  const normalized = message?.trim();
  if (!normalized) return;

  if (import.meta.env.DEV && devDetail?.trim()) {
    toast.success(`${normalized} ${devDetail.trim()}`);
    return;
  }

  toast.success(normalized);
}
