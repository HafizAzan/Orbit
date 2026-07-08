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

export type WorkspaceInvoiceDetailContext = {
  workspaceName?: string;
  billingEmail?: string | null;
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

export function getWorkspaceInvoiceDetail(
  invoice: BillingInvoice,
  context: WorkspaceInvoiceDetailContext = {},
): WorkspaceInvoiceDetail {
  const amount = invoice.amountPaid || invoice.amountDue;
  const description = invoice.number ? `Invoice ${invoice.number}` : "Workspace subscription";

  return {
    ...invoice,
    billingEmail: context.billingEmail ?? "—",
    workspaceName: context.workspaceName ?? "Workspace",
    lineItems: [{ description, quantity: 1, unitAmount: amount }],
    subtotal: amount,
    tax: 0,
    total: amount,
  };
}

export function resolveWorkspaceInvoices(apiInvoices: BillingInvoice[] | undefined) {
  return apiInvoices ?? [];
}

export const WORKSPACE_PLAN_ORDER: PlanCode[] = ["FREE", "PRO", "BUSINESS", "ENTERPRISE"];

export function resolveWorkspaceBillingPlans(products: BillingCatalogProduct[] | undefined): WorkspaceBillingPlan[] {
  if (!products?.length) return [];

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
