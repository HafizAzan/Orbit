import type { OrganizationPlan } from "../data/admin-organizations";
import type { BillingCycle, SubscriptionRecord, SubscriptionStatus } from "../data/admin-subscriptions";
import { normalizeEmail } from "./helper";

export type UpdateSubscriptionBillingInput = {
  contactEmail: string;
  plan: OrganizationPlan;
  billingCycle: BillingCycle;
  renewalDate: string;
  amount: number;
  status: SubscriptionStatus;
};

export function updateSubscriptionBilling(
  existing: SubscriptionRecord,
  input: UpdateSubscriptionBillingInput,
): SubscriptionRecord {
  return {
    ...existing,
    contactEmail: normalizeEmail(input.contactEmail),
    plan: input.plan,
    billingCycle: input.billingCycle,
    renewalDate: input.renewalDate,
    amount: input.amount,
    status: input.status,
  };
}
