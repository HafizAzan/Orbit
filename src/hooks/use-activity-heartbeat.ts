import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { recordActivityHeartbeat } from "../api-services/auth.service";
import { useAppContext } from "../context/app-context";
import { ACTIVITY_HEARTBEAT_INTERVAL_MS } from "../lib/activity-heartbeat.constants";
import { getAccessToken, isAuthSessionExpired } from "../lib/auth-session";
import {
  WORKSPACE_TEAM_MEMBERS_QUERY_KEY,
  WORKSPACE_TEAM_STATS_QUERY_KEY,
} from "./use-workspace-team";

function canSendHeartbeat(): boolean {
  return Boolean(getAccessToken()) && !isAuthSessionExpired() && document.visibilityState === "visible";
}

export function useActivityHeartbeat() {
  const { isAuthenticated, isBootstrapping } = useAppContext();
  const queryClient = useQueryClient();

  const sendHeartbeat = useCallback(async () => {
    if (!canSendHeartbeat()) return;

    try {
      await recordActivityHeartbeat();
      await queryClient.invalidateQueries({ queryKey: WORKSPACE_TEAM_MEMBERS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: WORKSPACE_TEAM_STATS_QUERY_KEY });
    } catch {
      // Ignore transient network/auth errors; the next interval will retry.
    }
  }, [queryClient]);

  useEffect(() => {
    if (!isAuthenticated || isBootstrapping) return;

    void sendHeartbeat();

    const intervalId = window.setInterval(() => {
      void sendHeartbeat();
    }, ACTIVITY_HEARTBEAT_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, isBootstrapping, sendHeartbeat]);
}
