import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  DashboardMetric,
  GrowthStat,
  ActivityItem,
  RevenueDataPoint,
  TopOrgItem,
  RecentSignupItem,
} from "../data/admin-dashboard";

const AUTH_REQUEST = { requireAuth: true } as const;

export type AdminDashboardOverview = {
  metrics: DashboardMetric[];
  growthStats: GrowthStat[];
  recentActivity: ActivityItem[];
  recentSignups: RecentSignupItem[];
  topOrgs: TopOrgItem[];
  churnRate: number;
  growthForecast: number;
};

const getDashboardOverview = async (): Promise<AdminDashboardOverview> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.DASHBOARD_OVERVIEW, AUTH_REQUEST);
  return assertApiSuccess<AdminDashboardOverview>(response);
};

const getDashboardRevenueSeries = async (): Promise<RevenueDataPoint[]> => {
  const response = await ApiService.get(API_ROUTES.ADMIN.DASHBOARD_REVENUE_SERIES, AUTH_REQUEST);
  return assertApiSuccess<RevenueDataPoint[]>(response);
};

export { getDashboardOverview, getDashboardRevenueSeries };
