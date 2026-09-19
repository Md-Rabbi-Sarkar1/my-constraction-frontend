import apiClient from "@/lib/api-client";
import { LoginPayload, VerifyAccountPayload } from "@/types/auth.type";
import { registerPayloadSchema, TRegisterPayload } from "@/validation";

export function userRegistration(payload: TRegisterPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}
export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}
export function userLogin (payload: LoginPayload) {
    return apiClient('/auth/login',{method:"POST", body:payload})
}
export function userLogout () {
    return apiClient('/auth/logout',{method:"POST"})
}
export function getMe () {
    return apiClient('/auth/getMe')
}

export function googleOAuth(payload:{idToken:string}){
    return apiClient('/auth/google',{method:"POST",body:payload})
}