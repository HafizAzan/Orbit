export type ContactLeadStatus = "new" | "reviewed" | "closed";

export type ContactLeadSubject =
  | "general"
  | "support"
  | "sales"
  | "partnership"
  | "billing"
  | "enterprise";

export type ContactLeadRecord = {
  id: string;
  fullName: string;
  email: string;
  companyName: string | null;
  subject: ContactLeadSubject;
  message: string;
  status: ContactLeadStatus;
  source: string;
  createdAt: string;
};

export const LEADS_PAGE_SIZE = 20;

export const LEAD_STATUS_OPTIONS: { value: ContactLeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "closed", label: "Closed" },
];

export const LEAD_SUBJECT_LABELS: Record<ContactLeadSubject, string> = {
  general: "General",
  support: "Support",
  sales: "Sales",
  partnership: "Partnership",
  billing: "Billing",
  enterprise: "Enterprise",
};
