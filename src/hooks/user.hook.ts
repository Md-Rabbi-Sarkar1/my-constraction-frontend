import { getManagers } from "@/api";
import { useQuery } from "@tanstack/react-query";


export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: getManagers,
    // 💡 Extracts the array directly so 'data' in your component becomes the array of managers
    select: (response) => response.data.manager, 
  });
}
