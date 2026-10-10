import { getMe, googleOAuth, userLogin, userLogout, userRegistration, verifyAccount } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}
export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}
export function useLogin() {
    return useMutation({
        mutationFn:userLogin
    })
}
export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn:userLogout,
         onSuccess: () => {
           
            queryClient.clear(); 

            
            router.push('/login');
            router.refresh(); 
        }
    })
}

export function useGoogleOAuth(){
    return useMutation({
        mutationFn:googleOAuth
    })
}
export function useGetMe(){
    return useQuery({
        queryKey:["user"],
        queryFn:getMe,
        retry:false,
    })
}