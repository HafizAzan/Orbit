import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamPresence } from "../../api-services/team.service";
import { getSocket } from "../../config/socket";
import { useAppContext } from "../../context/app-context";
import useRealtimeConnection from "../../hooks/use-realtime-connection";
import { useNotificationSocketListener } from "../../hooks/use-notifications";

export type OrgPresenceSnapshot = {
  onlineUserIds: string[];
};

export const orgPresenceQueryKey = ["workspace-org-presence"] as const;

type OrgPresenceContextValue = {
  onlineUserIds: string[];
  isOnline: (userId: string) => boolean;
  onlineCount: number;
};

const OrgPresenceContext = createContext<OrgPresenceContextValue>({
  onlineUserIds: [],
  isOnline: () => false,
  onlineCount: 0,
});

export function useOrgPresence() {
  return useContext(OrgPresenceContext);
}

type WorkspaceRealtimeProviderProps = {
  children: ReactNode;
};

function WorkspaceRealtimeProvider({ children }: WorkspaceRealtimeProviderProps) {
  const app = useAppContext();
  const queryClient = useQueryClient();
  const enabled = Boolean(app?.isAuthenticated && app?.user?.organization);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useRealtimeConnection(enabled);
  useNotificationSocketListener(enabled);

  const presenceQuery = useQuery({
    queryKey: orgPresenceQueryKey,
    queryFn: getTeamPresence,
    enabled,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (presenceQuery.data?.onlineUserIds) {
      setOnlineUserIds(presenceQuery.data.onlineUserIds);
    }
  }, [presenceQuery.data]);

  useEffect(() => {
    if (!enabled) {
      setOnlineUserIds([]);
      return;
    }

    const socket = getSocket();
    if (!socket) return;

    const handlePresenceUpdated = (snapshot: OrgPresenceSnapshot) => {
      setOnlineUserIds(snapshot.onlineUserIds ?? []);
      queryClient.setQueryData(orgPresenceQueryKey, snapshot);
    };

    socket.on("presence:updated", handlePresenceUpdated);

    return () => {
      socket.off("presence:updated", handlePresenceUpdated);
    };
  }, [enabled, queryClient]);

  const isOnline = useCallback(
    (userId: string) => onlineUserIds.includes(userId),
    [onlineUserIds],
  );

  const value = useMemo(
    () => ({
      onlineUserIds,
      isOnline,
      onlineCount: onlineUserIds.length,
    }),
    [isOnline, onlineUserIds],
  );

  return <OrgPresenceContext.Provider value={value}>{children}</OrgPresenceContext.Provider>;
}

export default React.memo(WorkspaceRealtimeProvider);
