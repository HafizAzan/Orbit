import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import { DEFAULT_PLATFORM_SETTINGS, type PlatformSettings } from "../data/admin-settings";

const AUTH_REQUEST = { requireAuth: true } as const;

function pickPlatformSettings(payload: Partial<PlatformSettings> & Record<string, unknown>): PlatformSettings {
  return {
    platformName: String(payload.platformName ?? DEFAULT_PLATFORM_SETTINGS.platformName),
    defaultLanguage: String(payload.defaultLanguage ?? DEFAULT_PLATFORM_SETTINGS.defaultLanguage),
    timezone: String(payload.timezone ?? DEFAULT_PLATFORM_SETTINGS.timezone),
    brandColor: String(payload.brandColor ?? DEFAULT_PLATFORM_SETTINGS.brandColor),
    logoUrl: String(payload.logoUrl ?? DEFAULT_PLATFORM_SETTINGS.logoUrl),
    faviconUrl: String(payload.faviconUrl ?? DEFAULT_PLATFORM_SETTINGS.faviconUrl),
    smtpHost: String(payload.smtpHost ?? DEFAULT_PLATFORM_SETTINGS.smtpHost),
    smtpPort: String(payload.smtpPort ?? DEFAULT_PLATFORM_SETTINGS.smtpPort),
    smtpUsername: String(payload.smtpUsername ?? DEFAULT_PLATFORM_SETTINGS.smtpUsername),
    smtpPassword: String(payload.smtpPassword ?? DEFAULT_PLATFORM_SETTINGS.smtpPassword),
    defaultCurrency: String(payload.defaultCurrency ?? DEFAULT_PLATFORM_SETTINGS.defaultCurrency),
    taxId: String(payload.taxId ?? DEFAULT_PLATFORM_SETTINGS.taxId),
    invoicePrefix: String(payload.invoicePrefix ?? DEFAULT_PLATFORM_SETTINGS.invoicePrefix),
  };
}

const getPlatformSettings = async (): Promise<PlatformSettings> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.SETTINGS, AUTH_REQUEST);
  return pickPlatformSettings(assertApiSuccess<Partial<PlatformSettings>>(response));
};

const updatePlatformSettings = async (
  data: Partial<PlatformSettings>,
): Promise<PlatformSettings> => {
  const response = await ApiService.patch(API_ROUTES.ADMIN.SETTINGS, data, AUTH_REQUEST);
  return pickPlatformSettings(assertApiSuccess<Partial<PlatformSettings>>(response));
};

const uploadPlatformLogo = async (file: File): Promise<PlatformSettings> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await ApiService.post(API_ROUTES.ADMIN.SETTINGS_LOGO, formData, {
    requireAuth: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return pickPlatformSettings(assertApiSuccess<Partial<PlatformSettings>>(response));
};

const uploadPlatformFavicon = async (file: File): Promise<PlatformSettings> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await ApiService.post(API_ROUTES.ADMIN.SETTINGS_FAVICON, formData, {
    requireAuth: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return pickPlatformSettings(assertApiSuccess<Partial<PlatformSettings>>(response));
};

export {
  getPlatformSettings,
  updatePlatformSettings,
  uploadPlatformLogo,
  uploadPlatformFavicon,
};
