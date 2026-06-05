import { AxiosResponse } from "axios";

//Services
import http from "src/services/httpService";
import { setLocalStorageLanguageId } from "src/services/localStorage";

//Config
import config from "src/config/config.json";

const { apiUrl } = config;

const apiEndPoint = apiUrl + "api/language/";
const currentLanguageData = "InstaPOSCurrentLanguage";

export interface LanguageData {
  id: string | number;
  name?: string;
  code?: string;
  image?: string;
  directory?: string;
  [key: string]: unknown;
}

export interface LanguagesApiResponse {
  data: LanguageData[];
}

export interface LanguageContentResponse {
  data: Record<string, string>;
  // if your API returns different shape, adjust this
  // e.g. data: { [key: string]: string }
}

export type LanguageListParams = Record<string, unknown>;

export function getAllLanguages(): Promise<
  AxiosResponse<LanguagesApiResponse>
> {
  return http.get<LanguagesApiResponse>(apiEndPoint + "getAllLanguages");
}

export async function setLanguage(data: LanguageData): Promise<void> {
  const languageId = String(data.id);

  setLocalStorageLanguageId(languageId);
  http.setLanguageId(languageId);
  localStorage.setItem(currentLanguageData, JSON.stringify(data));
  window.location.reload();
}

export function getLanguageData(
  path: string,
): Promise<AxiosResponse<LanguageContentResponse>> {
  return http.get<LanguageContentResponse>(
    apiEndPoint + "getLanguageByCode/" + path,
  );
}

export function getCurrentLanguage(): LanguageData | null {
  const raw = localStorage.getItem(currentLanguageData);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LanguageData;
  } catch {
    return null;
  }
}

export function getLanguagesData(params: LanguageListParams): Promise<unknown> {
  return http.get(apiEndPoint + "getList", params);
}
