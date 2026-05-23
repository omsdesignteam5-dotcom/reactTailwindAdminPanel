import { AxiosResponse } from "axios";

//Services
import http from "../services/httpService";
import { setLocalStorageLanguageId } from "../services/localStorage";

//Config
import config from "../config/config.json";

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

export function getLanguageData(path: string): Promise<unknown> {
  return http.get(apiEndPoint + "getLanguageByCode/" + path);
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
