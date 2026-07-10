import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyWorkBreakdown,
  askWorkspace,
  describeActivity,
  generateCalendarDraft,
  generateMembershipImpact,
  generateProjectDraft,
  generateProjectSummary,
  generateTaskDraft,
  generateTaskTip,
  generateWorkBreakdown,
} from "../api-services/ai.service";
import type {
  ApplyWorkBreakdownRequest,
  AskWorkspaceRequest,
  DescribeActivityRequest,
  GenerateCalendarDraftRequest,
  GenerateMembershipImpactRequest,
  GenerateProjectDraftRequest,
  GenerateProjectSummaryRequest,
  GenerateTaskDraftRequest,
  GenerateTaskTipRequest,
  GenerateWorkBreakdownRequest,
} from "../types/ai.types";
import { WORKSPACE_PROJECTS_QUERY_KEY } from "./use-workspace-projects";

export function useGenerateWorkBreakdown() {
  return useMutation({
    mutationFn: (data: GenerateWorkBreakdownRequest) => generateWorkBreakdown(data),
  });
}

export function useGenerateProjectSummary() {
  return useMutation({
    mutationFn: (data: GenerateProjectSummaryRequest) => generateProjectSummary(data),
  });
}

export function useGenerateProjectDraft() {
  return useMutation({
    mutationFn: (data: GenerateProjectDraftRequest) => generateProjectDraft(data),
  });
}

export function useGenerateTaskDraft() {
  return useMutation({
    mutationFn: (data: GenerateTaskDraftRequest) => generateTaskDraft(data),
  });
}

export function useDescribeActivity() {
  return useMutation({
    mutationFn: (data: DescribeActivityRequest) => describeActivity(data),
  });
}

export function useGenerateTaskTip() {
  return useMutation({
    mutationFn: (data: GenerateTaskTipRequest) => generateTaskTip(data),
  });
}

export function useGenerateMembershipImpact() {
  return useMutation({
    mutationFn: (data: GenerateMembershipImpactRequest) => generateMembershipImpact(data),
  });
}

export function useGenerateCalendarDraft() {
  return useMutation({
    mutationFn: (data: GenerateCalendarDraftRequest) => generateCalendarDraft(data),
  });
}

export function useAskWorkspace() {
  return useMutation({
    mutationFn: (data: AskWorkspaceRequest) => askWorkspace(data),
  });
}

export function useApplyWorkBreakdown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyWorkBreakdownRequest) => applyWorkBreakdown(data),
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: WORKSPACE_PROJECTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["workspace-project", variables.projectId] });
      await queryClient.invalidateQueries({ queryKey: ["workspace-tasks"] });
    },
  });
}
