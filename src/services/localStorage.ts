const BASE_TEXT = "InstaPOS";
const BASE_ROLE = "Admin";

const key = (suffix: string): string => BASE_TEXT + BASE_ROLE + suffix;

const KEYS = {
  token: key("Token"),
  currentUserData: key("Data"),
  currentUserId: key("Id"),
  currentUserRole: key("Role"),
  languagePath: key("LanguagePath"),
  languageName: key("LanguageName"),
  languageId: key("LanguageId"),
  languageImage: key("LanguageImage"),
  branchShopId: key("branchShopId"),
  branchShopName: key("branchShopName"),
  brandShopId: key("brandShopId"),
  currentShopInfo: key("CurrentShopInfo"),
  currentShopName: key("CurrentShopName"),
  currentShopLogo: key("CurrentShopLogo"),
  currentShopRoute: key("CurrentShopRoute"),
  isMainBranch: key("isMainBranch"),
  isStepFinished: key("isStepFinished"),
  level: key("level"),
  decimalPlace: key("DecimalPlace"),
  roudingAmount: key("RoudingAmount"),
  isFirstInstall: key("IsFirstInstall"),
  notification: key("Notification"),
  isDataUpdate: key("IsDataUpdate"),
  updateDataType: key("UpdateDataType"),
  database: key("Database"),
  shopCode: key("shopCode"),
  tableLayoutUpdate: key("tableLayoutUpdate"),
  isOfflineUser: key("IsOfflineUser"),
} as const;

const setString = (storageKey: string, value: string): void => {
  localStorage.setItem(storageKey, value);
};

const getString = (storageKey: string): string | null => {
  return localStorage.getItem(storageKey);
};

const removeKey = (storageKey: string): void => {
  localStorage.removeItem(storageKey);
};

const setJson = <T>(storageKey: string, value: T): void => {
  localStorage.setItem(storageKey, JSON.stringify(value));
};

const getJson = <T>(storageKey: string): T | null => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const getStringWithDefault = (storageKey: string, fallback: string): string => {
  return localStorage.getItem(storageKey) ?? fallback;
};

// Token
export const setLocalStorageToken = (data: string): void =>
  setString(KEYS.token, data);
export const getLocalStorageToken = (): string | null => getString(KEYS.token);
export const removeLocalStorageToken = (): void => removeKey(KEYS.token);

// Current user
export const setLocalStorageCurrentUserData = (data: string): void =>
  setString(KEYS.currentUserData, data);
export const getLocalStorageCurrentUserData = (): string | null =>
  getString(KEYS.currentUserData);
export const removeLocalStorageCurrentUserData = (): void =>
  removeKey(KEYS.currentUserData);

export const setLocalStorageCurrentUserId = (data: string): void =>
  setString(KEYS.currentUserId, data);
export const getLocalStorageCurrentUserId = (): string | null =>
  getString(KEYS.currentUserId);
export const removeLocalStorageCurrentUserId = (): void =>
  removeKey(KEYS.currentUserId);

export const setLocalStorageCurrentUserRole = (data: string): void =>
  setString(KEYS.currentUserRole, data);
export const getLocalStorageCurrentUserRole = (): string | null =>
  getString(KEYS.currentUserRole);
export const removeLocalStorageCurrentUserRole = (): void =>
  removeKey(KEYS.currentUserRole);

// Language
export const setLocalStorageLanguagePath = (data: string): void =>
  setString(KEYS.languagePath, data);
export const getLocalStorageLanguagePath = (): string | null =>
  getString(KEYS.languagePath);
export const removeLocalStorageLanguagePath = (): void =>
  removeKey(KEYS.languagePath);

export const setLocalStorageLanguageName = (data: string): void =>
  setString(KEYS.languageName, data);
export const getLocalStorageLanguageName = (): string | null =>
  getString(KEYS.languageName);
export const removeLocalStorageLanguageName = (): void =>
  removeKey(KEYS.languageName);

export const setLocalStorageLanguageId = (data: string): void =>
  setString(KEYS.languageId, data);
export const getLocalStorageLanguageId = (): string =>
  getStringWithDefault(KEYS.languageId, "1");
export const removeLocalStorageLanguageId = (): void =>
  removeKey(KEYS.languageId);

export const setLocalStorageLanguageImage = (data: string): void =>
  setString(KEYS.languageImage, data);
export const getLocalStorageLanguageImage = (): string | null =>
  getString(KEYS.languageImage);
export const removeLocalStorageLanguageImage = (): void =>
  removeKey(KEYS.languageImage);

// Shop Route
export const setLocalStorageCurrentShopRoute = (data: string): void =>
  setString(KEYS.currentShopRoute, data);
export const getLocalStorageCurrentShopRoute = (): string | null =>
  getString(KEYS.currentShopRoute);
export const removeLocalStorageCurrentShopRoute = (): void =>
  removeKey(KEYS.currentShopRoute);

// Shop IDs
export const setLocalStorageBranchShopId = (data: string): void =>
  setString(KEYS.branchShopId, data);
export const getLocalStorageBranchShopId = (): string =>
  getStringWithDefault(KEYS.branchShopId, "0");
export const removeLocalStorageBranchShopId = (): void =>
  removeKey(KEYS.branchShopId);

export const setLocalStorageBranchShopName = (data: string): void =>
  setString(KEYS.branchShopName, data);
export const getLocalStorageBranchShopName = (): string | null =>
  getString(KEYS.branchShopName);
export const removeLocalStorageBranchShopName = (): void =>
  removeKey(KEYS.branchShopName);

export const setLocalStorageBrandShopId = (data: string): void =>
  setString(KEYS.brandShopId, data);
export const getLocalStorageBrandShopId = (): string =>
  getStringWithDefault(KEYS.brandShopId, "0");
export const removeLocalStorageBrandShopId = (): void =>
  removeKey(KEYS.brandShopId);

// JSON examples
export const setLocalStorageNotification = <T>(data: T): void =>
  setJson(KEYS.notification, data);
export const getLocalStorageNotification = <T>(): T | null =>
  getJson<T>(KEYS.notification);
export const removeLocalStorageNotification = (): void =>
  removeKey(KEYS.notification);

export const setLocalStorageDatabase = <T>(data: T): void =>
  setJson(KEYS.database, data);
export const getLocalStorageDatabase = <T>(): T | null =>
  getJson<T>(KEYS.database);
export const removeLocalStorageDatabase = (): void => removeKey(KEYS.database);

// Simple flags/strings
export const setLocalStorageIsDataUpdate = (data: string): void =>
  setString(KEYS.isDataUpdate, data);
export const getLocalStorageIsDataUpdate = (): string | null =>
  getString(KEYS.isDataUpdate);
export const removeLocalStorageIsDataUpdate = (): void =>
  removeKey(KEYS.isDataUpdate);

export const setLocalStorageUpdateDataTypes = <T>(data: T): void =>
  setJson(KEYS.updateDataType, data);
export const getLocalStorageUpdateDataTypes = <T>(): T | null =>
  getJson<T>(KEYS.updateDataType);
export const removeLocalStorageUpdateDataTypes = (): void =>
  removeKey(KEYS.updateDataType);

export const setLocalStorageShopCode = (data: string): void =>
  setString(KEYS.shopCode, data);
export const getLocalStorageShopCode = (): string | null =>
  getString(KEYS.shopCode);
export const removeLocalStorageShopCode = (): void => removeKey(KEYS.shopCode);

export const setLocalStorageTableLayoutUpdate = (data: string): void =>
  setString(KEYS.tableLayoutUpdate, data);
export const getLocalStorageTableLayoutUpdate = (): string | null =>
  getString(KEYS.tableLayoutUpdate);
export const removeLocalStorageTableLayoutUpdate = (): void =>
  removeKey(KEYS.tableLayoutUpdate);

export const setLocalStorageIsOfflineUser = (data: string): void =>
  setString(KEYS.isOfflineUser, data);
export const getLocalStorageIsOfflineUser = (): string | null =>
  getString(KEYS.isOfflineUser);
export const removeLocalStorageIsOfflineUser = (): void =>
  removeKey(KEYS.isOfflineUser);

// Keep your existing remove-all behavior
export const removeAllLocalStorageItems = (): void => {
  removeLocalStorageToken();
  removeLocalStorageCurrentUserData();
  removeLocalStorageCurrentUserId();
  removeLocalStorageCurrentUserRole();
  removeLocalStorageLanguagePath();
  removeLocalStorageLanguageName();
  removeLocalStorageLanguageId();
  removeLocalStorageLanguageImage();
  removeLocalStorageBranchShopId();
  removeLocalStorageBranchShopName();
  removeLocalStorageBrandShopId();
  removeLocalStorageNotification();
  removeLocalStorageIsDataUpdate();
  removeLocalStorageUpdateDataTypes();
  removeLocalStorageTableLayoutUpdate();
  removeLocalStorageDatabase();
  removeLocalStorageShopCode();
  removeLocalStorageIsOfflineUser();
};
