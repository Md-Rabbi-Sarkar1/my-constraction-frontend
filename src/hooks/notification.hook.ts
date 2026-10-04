import { getCompanyNotifications, getNotificationById, markNotificationAsRead, NotificationFiltersPayload } from "@/api/notification.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useGetNotifications(filters: NotificationFiltersPayload) {
  return useQuery({
    // Include filters object inside the tracking array map to trigger automated server updates on toggle clicks
    queryKey: ["company-notifications-feed", filters],
    queryFn: () => getCompanyNotifications(filters),
    select: (response: any) => {
      const unpacked = response?.data?.result || response?.result || response;
      
      // Handle cases where the backend directly returns a flat array tuple
      if (Array.isArray(unpacked)) {
        return { notifications: unpacked, totalPages: 1 };
      }
      
      if (unpacked && Array.isArray(unpacked.notifications)) {
        return unpacked;
      }
      
      return { notifications: [], totalPages: 1 };
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Refresh the query filters instantly to reflect unread count balances on screen
      queryClient.invalidateQueries({ queryKey: ["company-notifications-feed"] });
    },
  });
}



export function useGetNotificationDetails(notificationId: string) {
  return useQuery({
    queryKey: ["notification-details", notificationId],
    queryFn: () => getNotificationById(notificationId),
    // 💡 Unpacks response.data.result exactly where your single data layout lives
    select: (response: any) => {
      const unpacked = response?.data?.result || response?.result || response;
      if (Array.isArray(unpacked)) {
        return unpacked.find((item: any) => item.id === notificationId);
      }
      return unpacked;
    },
    enabled: !!notificationId, // Only fires if notificationId is present in URL params
  });
}
