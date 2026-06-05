import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import {
  getLocalStorageLanguageId,
  getLocalStorageBranchShopId,
  getLocalStorageBrandShopId,
  getLocalStorageCurrentUserId,
  getLocalStorageToken,
  removeAllLocalStorageItems,
} from "src/services/localStorage";

type NullableString = string | null | undefined;
type CommonHeaders = Record<string, string>;

const commonHeaders = axios.defaults.headers.common as CommonHeaders;

function setHeader(name: string, value: NullableString): void {
  if (value == null || value === "") {
    delete commonHeaders[name];
    return;
  }
  commonHeaders[name] = value;
}

setHeader("X-WEB-CLIENT", "true");

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const statusText = error.response?.statusText ?? "Request failed";
    const expectedError =
      typeof status === "number" && status >= 400 && status < 500;

    const path = window.location.pathname || "";
    const isAutoLogin = path.includes("/shop/shopFloorPlanEditorAutoLogin");

    if (!expectedError) {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (isAutoLogin) {
        return Promise.reject(error);
      }
      removeAllLocalStorageItems();
      window.location.reload();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

function setToken(token: string): void {
  setHeader("Authorization", "Bearer " + token);
}

function removeToken(): void {
  delete commonHeaders.Authorization;
}

function setLanguageId(languageId: string): void {
  setHeader("languageId", languageId);
}

function setAdminID(adminID: string): void {
  setHeader("adminId", adminID);
}

function setBranchShopId(branchShopId: string): void {
  setHeader("branchShopId", branchShopId);
}

function setBrandShopId(brandShopId: string): void {
  setHeader("brandShopId", brandShopId);
}

const token = getLocalStorageToken();
const languageId = getLocalStorageLanguageId();
const adminID = getLocalStorageCurrentUserId();
const branchShopId = getLocalStorageBranchShopId();
const brandShopId = getLocalStorageBrandShopId();

if (token) setToken(token);
if (languageId) setLanguageId(languageId);
if (adminID) setAdminID(adminID);
if (branchShopId) setBranchShopId(branchShopId);
if (brandShopId) setBrandShopId(brandShopId);

const httpService = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => axios.get<T>(url, config),
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setToken,
  removeToken,
  setLanguageId,
  setAdminID,
  setBranchShopId,
  setBrandShopId,
};

export default httpService;
