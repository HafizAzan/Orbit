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
