import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type { OrganizationPlan } from "../data/admin-organizations";
import type {
  BillingCycle,
  SubscriptionRecord,
  SubscriptionStatus,
} from "../data/admin-subscriptions";

export type StatMetric = {
  value: number;
  percentage: number;
};

export type SubscriptionStats = {
  monthlyRevenue: StatMetric;
  annualRevenue: StatMetric;
  activePlans: StatMetric;
  expiredPlans: StatMetric;
};

export type PlanDistributionRecord = {
  code: OrganizationPlan;
  name: string;
  count: number;
  percentage: number;
};

export type UpdateSubscriptionBillingRequest = {
  contactEmail?: string;
  plan?: OrganizationPlan;
  billingCycle?: BillingCycle;
  renewalDate?: string;
  amount?: number;
  status?: SubscriptionStatus;
};

const AUTH_REQUEST = { requireAuth: true } as const;

const listSubscriptions = async (): Promise<SubscriptionRecord[]> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.SUBSCRIPTIONS, AUTH_REQUEST);
  return assertApiSuccess<SubscriptionRecord[]>(response);
};

const getSubscriptionStats = async (): Promise<SubscriptionStats> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.SUBSCRIPTION_STATS, AUTH_REQUEST);
  return assertApiSuccess<SubscriptionStats>(response);
};

const getPlanDistribution = async (): Promise<PlanDistributionRecord[]> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN_DISTRIBUTION, AUTH_REQUEST);
  return assertApiSuccess<PlanDistributionRecord[]>(response);
};

const updateSubscriptionBilling = async (
  id: string,
  data: UpdateSubscriptionBillingRequest,
): Promise<SubscriptionRecord> => {
  const response = await ApiService.patch(
    `${API_ROUTES.ADMIN.SUBSCRIPTIONS}/${id}/billing`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<SubscriptionRecord>(response);
};

export {
  getPlanDistribution,
  getSubscriptionStats,
  listSubscriptions,
  updateSubscriptionBilling,
};
