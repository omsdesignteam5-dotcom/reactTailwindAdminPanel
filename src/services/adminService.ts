import http from "src/services/httpService";
import config from "src/config/config.json";

const urlEndPoint = config.apiUrl + "api/admin/";

export async function getProfileData() {
  const response = await http.get(urlEndPoint + "getProfileData");
  return response.data;
}

export async function updateProfile(data: any) {
  const response = await http.post(urlEndPoint + "updateProfile", data);
  return response.data;
}
