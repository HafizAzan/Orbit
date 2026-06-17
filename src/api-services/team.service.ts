import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  ApiTeamMember,
  ApiTeamStats,
  InviteTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
  UpdateTeamMemberStatusRequest,
} from "../types/team.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const getTeamMembers = async (): Promise<ApiTeamMember[]> => {
  const response = await ApiService.get(API_ROUTES.TEAMS.MEMBERS, AUTH_REQUEST);
  return assertApiSuccess<ApiTeamMember[]>(response);
};

const getTeamStats = async (): Promise<ApiTeamStats> => {
  const response = await ApiService.get(API_ROUTES.TEAMS.STATS, AUTH_REQUEST);
  return assertApiSuccess<ApiTeamStats>(response);
};

const inviteTeamMember = async (data: InviteTeamMemberRequest): Promise<ApiTeamMember> => {
  const response = await ApiService.post(API_ROUTES.TEAMS.INVITES, data, AUTH_REQUEST);
  return assertApiSuccess<ApiTeamMember>(response);
};

const updateTeamMemberRole = async (
  memberId: string,
  data: UpdateTeamMemberRoleRequest,
): Promise<ApiTeamMember> => {
  const response = await ApiService.patch(
    `${API_ROUTES.TEAMS.MEMBERS}/${memberId}/role`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiTeamMember>(response);
};

const updateTeamMemberStatus = async (
  memberId: string,
  data: UpdateTeamMemberStatusRequest,
): Promise<ApiTeamMember> => {
  const response = await ApiService.patch(
    `${API_ROUTES.TEAMS.MEMBERS}/${memberId}/status`,
    data,
    AUTH_REQUEST,
  );
  return assertApiSuccess<ApiTeamMember>(response);
};

const resendTeamInvite = async (memberId: string): Promise<{ message: string }> => {
  const response = await ApiService.post(
    `${API_ROUTES.TEAMS.MEMBERS}/${memberId}/resend-invite`,
    {},
    AUTH_REQUEST,
  );
  return assertApiSuccess<{ message: string }>(response);
};

const resendAllPendingInvites = async (): Promise<{ message: string; count: number }> => {
  const response = await ApiService.post(API_ROUTES.TEAMS.RESEND_PENDING, {}, AUTH_REQUEST);
  return assertApiSuccess<{ message: string; count: number }>(response);
};

export {
  getTeamMembers,
  getTeamStats,
  inviteTeamMember,
  resendAllPendingInvites,
  resendTeamInvite,
  updateTeamMemberRole,
  updateTeamMemberStatus,
};
