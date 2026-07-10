import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type { PlatformSettings } from "../data/admin-settings";

const AUTH_REQUEST = { requireAuth: true } as const;

const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.SETTINGS, AUTH_REQUEST);
  return assertApiSuccess<PlatformSettings>(response);
};

const updatePlatformSettings = async (
  data: Partial<PlatformSettings>,
): Promise<PlatformSettings> => {
  const response = await ApiService.patch(API_ROUTES.ADMIN.SETTINGS, data, AUTH_REQUEST);
  return assertApiSuccess<PlatformSettings>(response);
};

const uploadPlatformLogo = async (file: File): Promise<PlatformSettings> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await ApiService.post(API_ROUTES.ADMIN.SETTINGS_LOGO, formData, {
    requireAuth: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return assertApiSuccess<PlatformSettings>(response);
};

const uploadPlatformFavicon = async (file: File): Promise<PlatformSettings> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await ApiService.post(API_ROUTES.ADMIN.SETTINGS_FAVICON, formData, {
    requireAuth: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return assertApiSuccess<PlatformSettings>(response);
};

export {
  getPlatformSettings,
  updatePlatformSettings,
  uploadPlatformLogo,
  uploadPlatformFavicon,
};
