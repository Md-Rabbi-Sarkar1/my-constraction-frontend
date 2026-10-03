import apiClient from "@/lib/ofetch-api-client";
import { AcceptInviteFormValues } from "@/validation/user.validation";

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




export interface InviteUserInput {
  name: string;
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "ENGINEER" | "WORKER";
}

export interface InviteUserResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export function inviteUser(data: InviteUserInput) {
  return apiClient<InviteUserResponse>("/user/invitations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}



export interface VerifyInviteResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export function verifyUserInvite(data: AcceptInviteFormValues) {
  return apiClient<VerifyInviteResponse>("/user/invitations/accept", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
