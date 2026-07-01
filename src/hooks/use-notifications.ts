import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type ApiNotification,
} from "../api-services/notification.service";
import { getSocket } from "../config/socket";

export const notificationsQueryKey = ["workspace-notifications"] as const;
export const notificationsUnreadQueryKey = ["workspace-notifications-unread"] as const;

export function useNotifications() {
  return useQuery({
    queryKey: notificationsQueryKey,
    queryFn: listNotifications,
    staleTime: 30_000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationsUnreadQueryKey,
    queryFn: getUnreadNotificationCount,
    staleTime: 15_000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: notificationsUnreadQueryKey });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      queryClient.invalidateQueries({ queryKey: notificationsUnreadQueryKey });
    },
  });
}

export function useNotificationSocketListener(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();
    if (!socket) return;

    const handleCreated = (notification: ApiNotification) => {
      queryClient.setQueryData<ApiNotification[]>(notificationsQueryKey, (current = []) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }

        return [notification, ...current];
      });

      queryClient.setQueryData<number>(notificationsUnreadQueryKey, (current = 0) => current + 1);
    };

    socket.on("notification:created", handleCreated);

    return () => {
      socket.off("notification:created", handleCreated);
    };
  }, [enabled, queryClient]);
}
