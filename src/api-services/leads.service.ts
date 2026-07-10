import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";

export type LeadSubject = "general" | "support" | "sales" | "partnership" | "billing" | "enterprise";

export type CreateLeadRequest = {
  fullName: string;
  email: string;
  companyName?: string;
  subject: LeadSubject;
  message: string;
  source?: string;
};

export type CreateLeadResponse = {
  message: string;
};

const createLead = async (data: CreateLeadRequest): Promise<CreateLeadResponse> => {
  const response = await ApiService.post(API_ROUTES.LEADS.CREATE, data);
  return assertApiSuccess<CreateLeadResponse>(response);
};

export { createLead };
