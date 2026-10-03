import { addProjectMember, getAllUsers, getManagers, inviteUser, InviteUserInput, verifyUserInvite } from "@/api";
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



export function useGetAllUsers() {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    // 💡 Extracts the users array directly from your Postman data structure layout
    select: (response: any) => {
      if (response?.data?.users) return response.data.users;
      if (response?.users) return response.users;
      if (Array.isArray(response)) return response;
      return [];
    },
  });
}


export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => addProjectMember(projectId, userId),
    onSuccess: () => {
      // 💡 Invalidates the active project details layout context so lists auto-sync instantly
      queryClient.invalidateQueries({ queryKey: ["project-dashboard", projectId] });
    },
  });
}

