import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdminUser,
  getAdminUserStats,
  listAdminUsersPage,
  updateAdminUser,
  updateAdminUserStatus,
  type UpdateAdminUserRequest,
  type UpdateAdminUserStatusRequest,
} from "../api-services/admin-users.service";
import type { UserStatus } from "../data/admin-users";
import type { PaginationParams } from "../types/pagination.types";

export function useAdminUsers(
  params: PaginationParams & { search?: string; status?: UserStatus; organizationId?: string } = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 25;

  return useQuery({
    queryKey: ["admin-users", page, limit, params.search ?? "", params.status ?? "", params.organizationId ?? ""],
    queryFn: () => listAdminUsersPage({ ...params, page, limit }),
  });
}

export function useAdminUserStats() {
  return useQuery({
    queryKey: ["admin-users-stats"],
    queryFn: getAdminUserStats,
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserStatusRequest }) =>
      updateAdminUserStatus(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-users-stats"] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserRequest }) =>
      updateAdminUser(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-users-stats"] });
    },
  });
}
