import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTeamMember,
  getTeamMembers,
  getTeamStats,
  inviteTeamMember,
  resendAllPendingInvites,
  resendTeamInvite,
  updateTeamMemberRole,
  updateTeamMemberStatus,
} from "../api-services/team.service";
import { ACTIVITY_HEARTBEAT_INTERVAL_MS } from "../lib/activity-heartbeat.constants";
import type {
  InviteTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
  UpdateTeamMemberStatusRequest,
} from "../types/team.types";

export const WORKSPACE_TEAM_MEMBERS_QUERY_KEY = ["workspace-team-members"] as const;
export const WORKSPACE_TEAM_STATS_QUERY_KEY = ["workspace-team-stats"] as const;

const TEAM_PRESENCE_REFETCH_INTERVAL_MS = ACTIVITY_HEARTBEAT_INTERVAL_MS;

function invalidateTeamQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: WORKSPACE_TEAM_MEMBERS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: WORKSPACE_TEAM_STATS_QUERY_KEY });
  queryClient.invalidateQueries({ queryKey: ["workspace-organization-members"] });
  queryClient.invalidateQueries({ queryKey: ["workspace-organization"] });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: WORKSPACE_TEAM_MEMBERS_QUERY_KEY,
    queryFn: () => getTeamMembers(),
    refetchInterval: TEAM_PRESENCE_REFETCH_INTERVAL_MS,
  });
}

export function useTeamStats() {
  return useQuery({
    queryKey: WORKSPACE_TEAM_STATS_QUERY_KEY,
    queryFn: getTeamStats,
    refetchInterval: TEAM_PRESENCE_REFETCH_INTERVAL_MS,
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
