import ApiService from "../config/client";
import { assertApiSuccess } from "../lib/api-error";
import API_ROUTES from "../router/api-routes";
import type {
  BillingCatalogResponse,
  BillingInvoicesResponse,
  BillingMessageResponse,
  CancelPlanRequest,
  ChangePlanRequest,
  ConfirmCheckoutRequest,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  CurrentSubscriptionResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from "../types/billing.types";

const AUTH_REQUEST = { requireAuth: true } as const;

const getCatalog = async (): Promise<BillingCatalogResponse> => {
  const response = await ApiService.get(API_ROUTES.BILLING.CATALOG);
  return assertApiSuccess<BillingCatalogResponse>(response);
};

const getCurrentSubscription = async (): Promise<CurrentSubscriptionResponse> => {
  const response = await ApiService.get(API_ROUTES.BILLING.SUBSCRIPTION, AUTH_REQUEST);
  return assertApiSuccess<CurrentSubscriptionResponse>(response);
};

const createCheckout = async (data: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.CHECKOUT, data, AUTH_REQUEST);
  return assertApiSuccess<CreateCheckoutResponse>(response);
};

const confirmCheckout = async (data: ConfirmCheckoutRequest): Promise<BillingMessageResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.CHECKOUT_CONFIRM, data, AUTH_REQUEST);
  return assertApiSuccess<BillingMessageResponse>(response);
};

const selectPlan = async (data: CreateCheckoutRequest): Promise<BillingMessageResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.SELECT_PLAN, data, AUTH_REQUEST);
  return assertApiSuccess<BillingMessageResponse>(response);
};

const cancelPlan = async (data: CancelPlanRequest = {}): Promise<BillingMessageResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.CANCEL, data, AUTH_REQUEST);
  return assertApiSuccess<BillingMessageResponse>(response);
};

const changePlan = async (data: ChangePlanRequest): Promise<BillingMessageResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.CHANGE_PLAN, data, AUTH_REQUEST);
  return assertApiSuccess<BillingMessageResponse>(response);
};

const refundPayment = async (data: RefundPaymentRequest = {}): Promise<RefundPaymentResponse> => {
  const response = await ApiService.post(API_ROUTES.BILLING.REFUND, data, AUTH_REQUEST);
  return assertApiSuccess<RefundPaymentResponse>(response);
};

const listInvoices = async (): Promise<BillingInvoicesResponse> => {
  const response = await ApiService.get(API_ROUTES.BILLING.INVOICES, AUTH_REQUEST);
  return assertApiSuccess<BillingInvoicesResponse>(response);
};

export {
  cancelPlan,
  changePlan,
  confirmCheckout,
  createCheckout,
  getCatalog,
  getCurrentSubscription,
  listInvoices,
  refundPayment,
  selectPlan,
};
