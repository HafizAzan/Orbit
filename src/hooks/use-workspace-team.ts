import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTeamMember,
  getTeamMemberDetail,
  getTeamMembersPage,
  getTeamStats,
  inviteTeamMember,
  removeTeamMemberFromSquad,
  resendAllPendingInvites,
  resendTeamInvite,
  updateTeamMemberRole,
  updateTeamMemberStatus,
} from "../api-services/team.service";
import type { PaginationParams } from "../types/pagination.types";
import type {
  InviteTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
  UpdateTeamMemberStatusRequest,
} from "../types/team.types";

export const WORKSPACE_TEAM_MEMBERS_QUERY_KEY = "workspace-team-members";
export const WORKSPACE_TEAM_STATS_QUERY_KEY = ["workspace-team-stats"] as const;

function invalidateTeamQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: [WORKSPACE_TEAM_MEMBERS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: WORKSPACE_TEAM_STATS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ["workspace-organization-members"] });
  queryClient.invalidateQueries({ queryKey: ["workspace-organization"] });
  queryClient.invalidateQueries({ queryKey: ["workspace-projects"] });
}

export function useTeamMembers(params: PaginationParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  return useQuery({
    queryKey: [WORKSPACE_TEAM_MEMBERS_QUERY_KEY, page, limit],
    queryFn: () => getTeamMembersPage({ page, limit }),
  });
}

export const WORKSPACE_TEAM_MEMBER_DETAIL_QUERY_KEY = "workspace-team-member-detail";

export function useTeamMemberDetail(memberId: string | null, enabled = true) {
  return useQuery({
    queryKey: [WORKSPACE_TEAM_MEMBER_DETAIL_QUERY_KEY, memberId],
    queryFn: () => getTeamMemberDetail(memberId!),
    enabled: enabled && Boolean(memberId),
  });
}

export function useTeamStats() {
  return useQuery({
    queryKey: WORKSPACE_TEAM_STATS_QUERY_KEY,
    queryFn: getTeamStats,
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteTeamMemberRequest) => inviteTeamMember(data),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateTeamMemberRoleRequest;
    }) => updateTeamMemberRole(memberId, data),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useUpdateTeamMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateTeamMemberStatusRequest;
    }) => updateTeamMemberStatus(memberId, data),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useResendTeamInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => resendTeamInvite(memberId),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useResendAllPendingInvites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resendAllPendingInvites(),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteTeamMember(memberId),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}

export function useRemoveTeamMemberFromSquad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeTeamMemberFromSquad(memberId),
    onSuccess: () => invalidateTeamQueries(queryClient),
  });
}
