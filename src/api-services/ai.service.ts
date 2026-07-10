import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  AiActivityDescribeResponse,
  AiApplyWorkBreakdownResponse,
  AiAskWorkspaceResponse,
  AiCalendarDraftResponse,
  AiMembershipImpactResponse,
  AiProjectDraftResponse,
  AiProjectSummaryResponse,
  AiTaskDraftResponse,
  AiTaskTipResponse,
  AiWorkBreakdownResponse,
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

const AUTH_REQUEST = { requireAuth: true } as const;

const generateWorkBreakdown = async (
  data: GenerateWorkBreakdownRequest,
): Promise<AiWorkBreakdownResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.WORK_BREAKDOWN_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiWorkBreakdownResponse>(response);
};

const generateProjectSummary = async (
  data: GenerateProjectSummaryRequest,
): Promise<AiProjectSummaryResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.PROJECT_SUMMARY_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiProjectSummaryResponse>(response);
};

const generateProjectDraft = async (
  data: GenerateProjectDraftRequest,
): Promise<AiProjectDraftResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.PROJECT_DRAFT_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiProjectDraftResponse>(response);
};

const generateTaskDraft = async (
  data: GenerateTaskDraftRequest,
): Promise<AiTaskDraftResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.TASK_DRAFT_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiTaskDraftResponse>(response);
};

const applyWorkBreakdown = async (
  data: ApplyWorkBreakdownRequest,
): Promise<AiApplyWorkBreakdownResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.WORK_BREAKDOWN_APPLY, data, AUTH_REQUEST);
  return assertApiSuccess<AiApplyWorkBreakdownResponse>(response);
};

const describeActivity = async (
  data: DescribeActivityRequest,
): Promise<AiActivityDescribeResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.ACTIVITY_DESCRIBE, data, AUTH_REQUEST);
  return assertApiSuccess<AiActivityDescribeResponse>(response);
};

const generateTaskTip = async (data: GenerateTaskTipRequest): Promise<AiTaskTipResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.TASK_TIP_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiTaskTipResponse>(response);
};

const generateMembershipImpact = async (
  data: GenerateMembershipImpactRequest,
): Promise<AiMembershipImpactResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.MEMBERSHIP_IMPACT_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiMembershipImpactResponse>(response);
};

const generateCalendarDraft = async (
  data: GenerateCalendarDraftRequest,
): Promise<AiCalendarDraftResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.CALENDAR_DRAFT_GENERATE, data, AUTH_REQUEST);
  return assertApiSuccess<AiCalendarDraftResponse>(response);
};

const askWorkspace = async (data: AskWorkspaceRequest): Promise<AiAskWorkspaceResponse> => {
  const response = await ApiService.post(API_ROUTES.AI.ASK_WORKSPACE, data, AUTH_REQUEST);
  return assertApiSuccess<AiAskWorkspaceResponse>(response);
};

export {
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
};
