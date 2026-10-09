// 📂 File Location: src/hooks/payment.hook.ts
import { useMutation } from "@tanstack/react-query";
import { 
  BkashPaymentResponse, 
  initiateBkashPayment, 
  InitiateBkashPaymentPayload 
} from "@/api/payment.api";
import { toast } from "@/components/ui/toast";

export function useInitiatePayment() {
  return useMutation<BkashPaymentResponse, any, InitiateBkashPaymentPayload>({
    mutationFn: (payload: InitiateBkashPaymentPayload) => initiateBkashPayment(payload),
    onSuccess: (response) => {
      // 💡 FIXED UNPACKER: Reads your backend return statement root layout directly
      const redirectUrl = response?.paymentUrl || (response as any)?.data?.paymentUrl || (response as any)?.data?.result?.paymentUrl;
      
      if (redirectUrl) {
        // REDIRECT THE URL: Instantly loads bKash secure sandbox portal
        window.location.assign(redirectUrl);
      } else {
        console.error("Redirection path value missing from server response packet.");
        toast.add({ title: "Payment initiated but redirection URL was not received cleanly."});
        
      }
    },
    onError: (err: any) => {
      // Safely access your Nest/Express server error messages
      const errorMsg = err?.data?.message || err?.message || "bKash handshake failed.";
      toast.add({ title: "Your company might already be marked as PAID"});
    }
  });
}
