import { DEFAULT_SETTINGS_TAB, SETTINGS_TAB_SLUGS, type SettingsSectionId } from "../data/admin-settings";

type FormatDateOptions = {
  month?: "short" | "long" | "numeric" | "2-digit" | "narrow";
  day?: "numeric" | "2-digit";
  year?: "numeric" | "2-digit";
};

export function formatDate(date: string | Date, options?: FormatDateOptions) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    month: options?.month ?? "short",
    day: options?.day ?? "numeric",
    year: options?.year ?? "numeric",
  }).format(value);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatCurrency(value: number, currency = "USD", maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}

export function formatCurrencyCompact(value: number) {
  return `$${Math.round(value / 1000)}k`;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeText(value: string) {
  return value.trim();
}

export function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase();
}

export function pluralize(count: number, singular: string, plural?: string) {
  if (count === 1) return singular;
  return plural ?? `${singular}s`;
}

export function generateOtpCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function paginateItems<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function matchesSearchQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export function countObjectChanges<T extends Record<string, unknown>>(current: T, saved: T) {
  return (Object.keys(current) as (keyof T)[]).reduce((count, key) => {
    return current[key] === saved[key] ? count : count + 1;
  }, 0);
}

export function normalizeHexColor(color: string) {
  const raw = color.trim().replace(/^#/, "");

  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((channel) => channel + channel)
      .join("")}`.toUpperCase();
  }

  // Drop alpha channel when present (#RRGGBBAA)
  return `#${raw.slice(0, 6)}`.toUpperCase();
}

export function isSameHexColor(a: string, b: string) {
  return normalizeHexColor(a) === normalizeHexColor(b);
}

export function getSettingsTabSlug(sectionId: SettingsSectionId) {
  return SETTINGS_TAB_SLUGS[sectionId];
}

export function getSettingsSectionFromTab(tab: string | null): SettingsSectionId {
  if (!tab) return DEFAULT_SETTINGS_TAB;

  const match = Object.entries(SETTINGS_TAB_SLUGS).find(([, slug]) => slug === tab);
  return match ? (match[0] as SettingsSectionId) : DEFAULT_SETTINGS_TAB;
}

export function isValidSettingsTab(tab: string | null) {
  if (!tab) return false;
  return Object.values(SETTINGS_TAB_SLUGS).includes(tab);
}

export function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter";
  }

  if (!/\d/.test(password)) {
    return "Password must include a number";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include a special character";
  }

  return null;
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? ""}*@${domain}`;
  }

  return `${localPart.slice(0, 2)}${"*".repeat(Math.min(localPart.length - 2, 6))}@${domain}`;
}
