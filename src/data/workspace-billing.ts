import type { BillingInvoice } from "../types/billing.types";
import type { BillingCatalogProduct, PlanCode, PricingPlanCard } from "../types/billing.types";
import { mapCatalogToPricingPlans } from "../lib/pricing-catalog";

export type WorkspaceBillingPlan = PricingPlanCard & {
  plan: PlanCode;
};

export type WorkspaceInvoiceLineItem = {
  description: string;
  quantity: number;
  unitAmount: number;
};

export type WorkspaceInvoiceDetail = BillingInvoice & {
  billingEmail: string;
  workspaceName: string;
  lineItems: WorkspaceInvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
};

export const WORKSPACE_INVOICE_STATUS_STYLES: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  paid: {
    label: "Paid",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  open: {
    label: "Open",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  draft: {
    label: "Draft",
    badge: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
  },
  void: {
    label: "Void",
    badge: "border-slate-200 bg-slate-50 text-slate-500",
    dot: "bg-slate-400",
  },
  uncollectible: {
    label: "Uncollectible",
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};

export const WORKSPACE_MOCK_INVOICES: BillingInvoice[] = [
  {
    id: "inv_fs_2048",
    number: "FS-2048",
    status: "paid",
    amountDue: 0,
    amountPaid: 1299,
    currency: "USD",
    hostedInvoiceUrl: null,
    invoicePdf: null,
    createdAt: "2025-11-12T09:15:00.000Z",
    periodStart: "2025-11-12T00:00:00.000Z",
    periodEnd: "2026-11-12T00:00:00.000Z",
    refundable: false,
    refundWindowEndsAt: null,
  },
  {
    id: "inv_fs_1987",
    number: "FS-1987",
    status: "paid",
    amountDue: 0,
    amountPaid: 1299,
    currency: "USD",
    hostedInvoiceUrl: null,
    invoicePdf: null,
    createdAt: "2024-11-12T09:15:00.000Z",
    periodStart: "2024-11-12T00:00:00.000Z",
    periodEnd: "2025-11-12T00:00:00.000Z",
    refundable: false,
    refundWindowEndsAt: null,
  },
  {
    id: "inv_fs_1921",
    number: "FS-1921",
    status: "paid",
    amountDue: 0,
    amountPaid: 1299,
    currency: "USD",
    hostedInvoiceUrl: null,
    invoicePdf: null,
    createdAt: "2023-11-12T09:15:00.000Z",
    periodStart: "2023-11-12T00:00:00.000Z",
    periodEnd: "2024-11-12T00:00:00.000Z",
    refundable: false,
    refundWindowEndsAt: null,
  },
  {
    id: "inv_fs_1855",
    number: "FS-1855",
    status: "paid",
    amountDue: 0,
    amountPaid: 999,
    currency: "USD",
    hostedInvoiceUrl: null,
    invoicePdf: null,
    createdAt: "2022-11-12T09:15:00.000Z",
    periodStart: "2022-11-12T00:00:00.000Z",
    periodEnd: "2023-11-12T00:00:00.000Z",
    refundable: false,
    refundWindowEndsAt: null,
  },
];

const WORKSPACE_INVOICE_DETAILS: Record<string, Omit<WorkspaceInvoiceDetail, keyof BillingInvoice>> = {
  inv_fs_2048: {
    billingEmail: "billing@acme.com",
    workspaceName: "Acme Workspace",
    lineItems: [
      { description: "Enterprise Plan — Annual", quantity: 1, unitAmount: 1199 },
      { description: "Additional seats (25)", quantity: 25, unitAmount: 4 },
    ],
    subtotal: 1299,
    tax: 0,
    total: 1299,
  },
  inv_fs_1987: {
    billingEmail: "billing@acme.com",
    workspaceName: "Acme Workspace",
    lineItems: [{ description: "Enterprise Plan — Annual", quantity: 1, unitAmount: 1299 }],
    subtotal: 1299,
    tax: 0,
    total: 1299,
  },
  inv_fs_1921: {
    billingEmail: "billing@acme.com",
    workspaceName: "Acme Workspace",
    lineItems: [{ description: "Enterprise Plan — Annual", quantity: 1, unitAmount: 1299 }],
    subtotal: 1299,
    tax: 0,
    total: 1299,
  },
  inv_fs_1855: {
    billingEmail: "billing@acme.com",
    workspaceName: "Acme Workspace",
    lineItems: [{ description: "Business Plan — Annual", quantity: 1, unitAmount: 999 }],
    subtotal: 999,
    tax: 0,
    total: 999,
  },
};

export function getWorkspaceInvoiceDetail(invoice: BillingInvoice): WorkspaceInvoiceDetail {
  const extra = WORKSPACE_INVOICE_DETAILS[invoice.id];

  if (extra) {
    return { ...invoice, ...extra };
  }

  return {
    ...invoice,
    billingEmail: "billing@acme.com",
    workspaceName: "Acme Workspace",
    lineItems: [{ description: "Subscription", quantity: 1, unitAmount: invoice.amountPaid || invoice.amountDue }],
    subtotal: invoice.amountPaid || invoice.amountDue,
    tax: 0,
    total: invoice.amountPaid || invoice.amountDue,
  };
}

export function resolveWorkspaceInvoices(apiInvoices: BillingInvoice[] | undefined) {
  if (apiInvoices?.length) return apiInvoices;
  return WORKSPACE_MOCK_INVOICES;
}

export const WORKSPACE_PLAN_ORDER: PlanCode[] = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"];

export const WORKSPACE_MOCK_BILLING_PLANS: WorkspaceBillingPlan[] = [
  {
    id: "plan-pro",
    priceId: "price_pro_mock",
    plan: "PRO",
    name: "Pro",
    description: "For growing teams that need more projects and automation.",
    price: "$29",
    priceSuffix: "/user/mo",
    features: [
      "Up to 25 team members",
      "Unlimited projects & boards",
      "Advanced task workflows",
      "Email support",
      "5 GB file storage per user",
    ],
    ctaLabel: "Upgrade to Pro",
    ctaType: "checkout",
    highlighted: false,
  },
  {
    id: "plan-business",
    priceId: "price_business_mock",
    plan: "BUSINESS",
    name: "Business",
    description: "For organizations scaling collaboration across departments.",
    price: "$79",
    priceSuffix: "/user/mo",
    features: [
      "Up to 100 team members",
      "Priority support",
      "Custom roles & permissions",
      "Advanced reporting",
      "SSO & audit logs",
      "25 GB file storage per user",
    ],
    ctaLabel: "Upgrade to Business",
    ctaType: "checkout",
    highlighted: true,
    badge: "Most popular",
  },
  {
    id: "plan-enterprise",
    priceId: "price_enterprise_mock",
    plan: "ENTERPRISE",
    name: "Enterprise",
    description: "For large teams with advanced security and compliance needs.",
    price: "$129",
    priceSuffix: "/user/mo",
    features: [
      "Unlimited team members",
      "Dedicated success manager",
      "Custom integrations & API",
      "Enterprise SSO & SCIM",
      "99.9% uptime SLA",
      "Unlimited storage",
    ],
    ctaLabel: "Contact sales",
    ctaType: "contact",
    highlighted: false,
  },
];

export function resolveWorkspaceBillingPlans(products: BillingCatalogProduct[] | undefined): WorkspaceBillingPlan[] {
  if (!products?.length) return WORKSPACE_MOCK_BILLING_PLANS;

  return mapCatalogToPricingPlans(products).map((plan, index) => ({
    ...plan,
    plan: products[index]?.plan ?? "PRO",
  }));
}

export function getWorkspacePlanActionLabel(currentPlan: PlanCode, targetPlan: PlanCode) {
  if (currentPlan === targetPlan) return "Current plan";

  const currentIndex = WORKSPACE_PLAN_ORDER.indexOf(currentPlan);
  const targetIndex = WORKSPACE_PLAN_ORDER.indexOf(targetPlan);

  if (targetIndex > currentIndex) return "Upgrade";
  return "Switch plan";
}

export function isWorkspaceMockPriceId(priceId: string) {
  return priceId.endsWith("_mock");
}
