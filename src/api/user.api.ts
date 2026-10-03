import apiClient from "@/lib/ofetch-api-client";

export interface IManager {
  id: string;
  name: string;
}


export interface GetManagersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    manager: IManager[]; 
  };
}

export function getManagers() {
  return apiClient<GetManagersResponse>("/user/managers", { method: "GET" });
}
