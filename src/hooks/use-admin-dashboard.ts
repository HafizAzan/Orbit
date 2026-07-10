import { useQuery } from "@tanstack/react-query";
import {
  getDashboardOverview,
  getDashboardRevenueSeries,
} from "../api-services/admin-dashboard.service";

export function useAdminDashboardOverview() {
  return useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: getDashboardOverview,
  });
}

export function useAdminDashboardRevenueSeries() {
  return useQuery({
    queryKey: ["admin-dashboard-revenue-series"],
    queryFn: getDashboardRevenueSeries,
  });
}
