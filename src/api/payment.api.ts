// 📂 File Location: src/api/payment.api.ts
// import { apiClient } from "@/lib/ofetch-api-client";

import apiClient from "@/lib/ofetch-api-client";

export interface InitiateBkashPaymentPayload {
  amount: number| string;
}

// 💡 FIXED: Reflects your backend's exact flat return structural schema contract
export interface BkashPaymentResponse {
  paymentUrl: string; 
}

// Maps strictly to POST /api/company/pay
export function initiateBkashPayment(payload: InitiateBkashPaymentPayload) {
  return apiClient<BkashPaymentResponse>("/payment/create", {
    method: "POST",
    body: payload,
  });
}
