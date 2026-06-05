import http from "src/services/httpService";
import config from "src/config/config.json";
import {
  setLocalStorageToken,
  setLocalStorageBrandShopId,
  setLocalStorageCurrentUserId,
  setLocalStorageCurrentUserData,
} from "src/services/localStorage";

const urlEndPoint = config.apiUrl + "api/auth/";

//
// Login
//
export async function login(postData: any) {
  const response = await http.post(urlEndPoint + "login", postData);
  const data = response.data;

  if (data.result) {
    const adminId = String(data.userInfo?.id ?? "");
    http.setToken(data.access_token);
    if (adminId) {
      setLocalStorageCurrentUserId(adminId);
      http.setAdminID(adminId);
    }
    setLocalStorageToken(data.access_token);
    setLocalStorageCurrentUserData(JSON.stringify(data.userInfo));
    setLocalStorageBrandShopId("0");

    const tokenChangedEvent = new Event("tokenChanged");
    window.dispatchEvent(tokenChangedEvent);
  }

  return data;
}
