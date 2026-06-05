import http from "src/services/httpService";
import config from "src/config/config.json";

const urlEndPoint = config.apiUrl + "api/user/";

//
// Get Users List
//
export async function getUsersData(params: any) {
  const response = await http.get<{ data?: any[]; totalCount?: number }>(
    urlEndPoint + "getList",
    { params },
  );
  return response.data;
}

//
// Get User By Id
//
export async function getUserDataById(id: number | string) {
  const response = await http.get(urlEndPoint + "getById/" + id);

  return response.data;
}

//
// Create Or Update User
//
export async function createOrUpdateUser(payload: any) {
  const response = await http.post(urlEndPoint + "createOrUpdateUser", payload);

  return response.data;
}

//
// Delete User
//
export async function deleteUser(id: number | string) {
  const response = await http.post(urlEndPoint + "deleteUser/" + id);

  return response.data;
}
