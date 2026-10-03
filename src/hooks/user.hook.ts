import { getManagers, inviteUser, InviteUserInput, verifyUserInvite } from "@/api";
import { AcceptInviteFormValues } from "@/validation/user.validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
    // 💡 Extracts the array directly so 'data' in your component becomes the array of managers
    select: (response) => response.data.manager, 
  });
}


export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: InviteUserInput) => inviteUser(values),
    onSuccess: () => {
      // Invalidates user list cache to sync UI updates
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}


export function useVerifyInvite() {
  return useMutation({
    mutationFn: (values: AcceptInviteFormValues) => verifyUserInvite(values),
  });
}
