import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentOrganization,
  getOrganizationAbout,
  getOrganizationMembers,
  removeOrganizationMember,
  updateCurrentOrganization,
  updateOrganizationMemberEmail,
  updateOrganizationMemberRole,
} from "../api-services/organization.service";
import type {
  UpdateOrganizationMemberEmailRequest,
  UpdateOrganizationMemberRoleRequest,
  UpdateWorkspaceOrganizationRequest,
} from "../types/organization.types";

export const WORKSPACE_ORGANIZATION_QUERY_KEY = ["workspace-organization"] as const;
export const WORKSPACE_ORGANIZATION_ABOUT_QUERY_KEY = ["workspace-organization-about"] as const;
export const WORKSPACE_ORGANIZATION_MEMBERS_QUERY_KEY = ["workspace-organization-members"] as const;

export function useWorkspaceOrganization() {
  return useQuery({
    queryKey: WORKSPACE_ORGANIZATION_QUERY_KEY,
    queryFn: getCurrentOrganization,
  });
}

export function useOrganizationAbout(enabled = true) {
  return useQuery({
    queryKey: WORKSPACE_ORGANIZATION_ABOUT_QUERY_KEY,
    queryFn: getOrganizationAbout,
    enabled,
  });
}

export function useUpdateWorkspaceOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceOrganizationRequest) => updateCurrentOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_QUERY_KEY });
    },
  });
}

export function useOrganizationMembers() {
  return useQuery({
    queryKey: WORKSPACE_ORGANIZATION_MEMBERS_QUERY_KEY,
    queryFn: () => getOrganizationMembers(),
  });
}

export function useUpdateOrganizationMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateOrganizationMemberRoleRequest;
    }) => updateOrganizationMemberRole(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_QUERY_KEY });
    },
  });
}

export function useUpdateOrganizationMemberEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: string;
      data: UpdateOrganizationMemberEmailRequest;
    }) => updateOrganizationMemberEmail(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_QUERY_KEY });
    },
  });
}

export function useRemoveOrganizationMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeOrganizationMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_MEMBERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_ORGANIZATION_QUERY_KEY });
    },
  });
}
