import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { getAccessToken } from "../lib/cookies";

const BASE_URL = import.meta.env.VITE_API_URL;

const apiSauceInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiSauceInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const ApiResponseHandler = (response: AxiosResponse) => response?.data ?? response;
const ApiErrorHandler = (error: AxiosError) => error?.response?.data ?? error;

const ApiReqHandler = async (
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data: any = null,
  requestConfig: AxiosRequestConfig = {},
  isReturnAllResponse: boolean = false,
) => {
  try {
    const response = await apiSauceInstance.request({
      method,
      url,
      data,
      ...requestConfig,
    });
    return isReturnAllResponse ? response : ApiResponseHandler(response);
  } catch (error: unknown) {
    return ApiErrorHandler(error as AxiosError);
  }
};

const ApiService = {
  get: (url: string, requestConfig: AxiosRequestConfig = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("get", url, null, requestConfig, isReturnAllResponse),

  post: (url: string, data: any = null, requestConfig: AxiosRequestConfig = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("post", url, data, requestConfig, isReturnAllResponse),

  put: (url: string, data: any = null, requestConfig: AxiosRequestConfig = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("put", url, data, requestConfig, isReturnAllResponse),

  patch: (url: string, data: any = null, requestConfig: AxiosRequestConfig = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("patch", url, data, requestConfig, isReturnAllResponse),

  delete: (url: string, requestConfig: AxiosRequestConfig = {}, isReturnAllResponse: boolean = false) =>
    ApiReqHandler("delete", url, null, requestConfig, isReturnAllResponse),
};

export default ApiService;
